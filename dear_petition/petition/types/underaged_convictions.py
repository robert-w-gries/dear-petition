import logging
from dateutil.relativedelta import relativedelta

from django.utils import timezone
from django.db.models import Q, F, DurationField, ExpressionWrapper

from dear_petition.petition.models import OffenseRecord
from dear_petition.petition.types.dismissed import build_query as build_dismissed_query
from dear_petition.petition.types.not_guilty import (
    build_query as build_not_guilty_query,
)
from dear_petition.petition.utils import resolve_dob

logger = logging.getLogger(__name__)


def get_offense_records(batch, jurisdiction=""):
    qs = OffenseRecord.objects.filter(offense__ciprs_record__batch=batch)
    if not qs.exists():
        return qs

    dob = resolve_dob(qs)
    if not dob:
        return qs  # We can't determine this petition type without the date of birth

    if jurisdiction:
        qs = qs.filter(offense__ciprs_record__jurisdiction=jurisdiction)

    query = build_query(dob)
    qs = qs.filter(query).exclude(severity="INFRACTION")

    return qs


def build_query(dob):
    eighteenth_birthday = dob + relativedelta(years=18)
    logger.debug(f"Using {eighteenth_birthday} as eighteenth birthday (dob={dob})")
    dismissed_query = build_dismissed_query()
    not_guilty_query = build_not_guilty_query()
    action = Q(offense__ciprs_record__offense_date__date__lt=eighteenth_birthday)
    query = action & ~dismissed_query & ~not_guilty_query
    return query
