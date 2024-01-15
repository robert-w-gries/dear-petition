# Generated by Django 2.2.10 on 2020-04-07 17:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("petition", "0017_auto_20200209_0229"),
    ]

    operations = [
        migrations.AddField(
            model_name="ciprsrecord",
            name="arrest_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="case_status",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="county",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="dob",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="file_no",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="jurisdiction",
            field=models.CharField(
                choices=[
                    ("D", "DISTRICT COURT"),
                    ("S", "SUPERIOR COURT"),
                    ("N/A", "NOT AVAILABLE"),
                ],
                default="N/A",
                max_length=16,
            ),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="offense_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="race",
            field=models.CharField(blank=True, max_length=256),
        ),
        migrations.AddField(
            model_name="ciprsrecord",
            name="sex",
            field=models.CharField(
                choices=[
                    ("M", "Male"),
                    ("F", "Female"),
                    ("U", "Unknown"),
                    ("N/A", "NOT AVAILABLE"),
                ],
                default="N/A",
                max_length=6,
            ),
        ),
    ]
