# Generated by Django 3.2.13 on 2023-10-12 13:05

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("petition", "0058_contact_county"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contact",
            name="address2",
            field=models.CharField(
                blank=True, default="", max_length=512, verbose_name="Address (Line 2)"
            ),
        ),
    ]
