# Generated by Django 2.2.13 on 2020-08-02 14:19

from django.db import migrations
from django.db.models import Q


def add_files(apps, schema_editor):
    CIPRSRecord = apps.get_model("petition", "CIPRSRecord")
    BatchFile = apps.get_model("petition", "BatchFile")
    records = CIPRSRecord.objects.exclude(Q(report_pdf=None) | Q(report_pdf="")).select_related(
        "batch"
    )
    for record in records:
        batch_file = record.batch.files.create(file=record.report_pdf)
        print(f"Added batch file {batch_file.file.name}")


def remove_files(apps, schema_editor):
    BatchFile = apps.get_model("petition", "BatchFile")
    BatchFile.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("petition", "0033_batchfile"),
    ]

    operations = [migrations.RunPython(add_files, remove_files)]
