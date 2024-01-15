# Generated by Django 3.2.13 on 2022-10-16 19:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("sendgrid", "0003_alter_email_spam_score"),
        ("petition", "0048_ciprsrecord_batch_file"),
    ]

    operations = [
        migrations.AddField(
            model_name="batch",
            name="emails",
            field=models.ManyToManyField(blank=True, related_name="batches", to="sendgrid.Email"),
        ),
    ]
