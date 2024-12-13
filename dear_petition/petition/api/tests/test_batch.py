import pytest
import datetime

from django.urls import reverse
from django.utils import timezone
from django.utils.datastructures import MultiValueDict

from rest_framework import status

from dear_petition.petition.tests.factories import (
    BatchFactory,
    CIPRSRecordFactory,
    OffenseFactory,
    ClientFactory,
    OffenseRecordFactory,
    UserFactory,
)

pytestmark = pytest.mark.django_db


def test_unauthorized_batch_post(api_client_anon):
    response = api_client_anon.post(reverse("api:batch-list"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_batch_post_file(api_client, fake_pdf, mock_import):
    """Test POST functionality w/o testing actual ETL."""
    data = {"files": [fake_pdf]}
    response = api_client.post(reverse("api:batch-list"), data=data)
    assert response.status_code == status.HTTP_201_CREATED
    assert mock_import.assert_called_once
    assert "id" in response.data


def test_batch_post_multiple_files(api_client, fake_pdf, fake_pdf2, mock_import):
    """Test POST with multiple files functionality w/o testing actual ETL."""
    data = {"files": [fake_pdf, fake_pdf2]}
    response = api_client.post(reverse("api:batch-list"), data=data)
    assert response.status_code == status.HTTP_201_CREATED
    assert mock_import.assert_called_once
    assert "id" in response.data


def test_adjust_for_new_client_dob():
    """Test that when a DOB is added or updated on the client, the batch is updated accordingly."""

    batch = BatchFactory()
    record = CIPRSRecordFactory(batch=batch, offense_date=datetime.date(2000, 1, 1), dob=None)
    offense = OffenseFactory(ciprs_record=record, disposition_method="OTHER")  # Conviction charge
    offense_record = OffenseRecordFactory(action="CONVICTED", offense=offense)

    client = ClientFactory(dob=timezone.now().date())  # Create a youngster
    batch.client = client
    batch.save()
    batch.adjust_for_new_client_dob()

    assert offense_record in batch.underaged_conviction_records()

    batch.client.dob = datetime.date(1800, 1, 1)  # Update the youngster to be an elder
    batch.client.save()
    batch.refresh_from_db()  # adjust_for_new_client_dob should get automatically called in Client save
    assert offense_record not in batch.underaged_conviction_records()

    client = ClientFactory(dob=datetime.date(1800, 1, 1))  # Create an elder
    batch.client = client
    batch.save()
    batch.adjust_for_new_client_dob()
    assert offense_record not in batch.underaged_conviction_records()

    batch.client.dob = timezone.now().date()  # Update the elder to be a youngster
    batch.client.save()
    batch.refresh_from_db()  # adjust_for_new_client_dob should get automatically called in Client save
    assert offense_record in batch.underaged_conviction_records()

    # try un-setting client to test default behavior when no DOB known
    batch.client = None
    batch.save()
    batch.adjust_for_new_client_dob()
    assert offense_record not in batch.underaged_conviction_records()


def test_populate_client_dob_from_batch_dob(api_client):
    """
    Tests that when client dob is left empty, it is populated from the batch dob when
    batch has an available dob value.
    """
    # set up a user that will have access to the batch/client data
    user = UserFactory()
    api_client.force_authenticate(user=user)

    # set dob to use for the batch record and create batch/record
    dob = datetime.date(1992, 1, 28)
    batch = BatchFactory(user=user, client=None)
    CIPRSRecordFactory(batch=batch, dob=dob)  # add record with DOB to batch

    client = ClientFactory(user=user, dob=None)  # add client with no DOB
    assert client.dob == None

    # use API to assign the client to the batch
    data = {"client_id": client.pk}
    api_client.post(reverse("api:batch-assign-client-to-batch", args=[batch.pk]), data=data)

    # check that client dob updated appropriately during assignment
    client.refresh_from_db()
    assert client.dob == dob
