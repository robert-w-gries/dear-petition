# Generated by Django 2.2.13 on 2020-08-07 13:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("petition", "0035_remove_ciprsrecord_report_pdf"),
    ]

    operations = [
        migrations.AddField(
            model_name="offenserecord",
            name="plea",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AddField(
            model_name="offenserecord",
            name="verdict",
            field=models.CharField(blank=True, max_length=256),
        ),
    ]
