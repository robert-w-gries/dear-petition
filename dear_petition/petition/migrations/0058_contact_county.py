# Generated by Django 3.2.13 on 2023-10-12 13:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("petition", "0057_ciprsrecord_has_additional_offenses"),
    ]

    operations = [
        migrations.AddField(
            model_name="contact",
            name="county",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
