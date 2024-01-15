# Generated by Django 2.2.27 on 2022-03-19 22:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("petition", "0042_auto_20220123_0109"),
    ]

    operations = [
        migrations.RemoveField(model_name="petition", name="offense_records"),
        migrations.CreateModel(
            name="PetitionOffenseRecord",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("active", models.BooleanField(default=True)),
            ],
        ),
        migrations.RemoveField(
            model_name="offenserecord",
            name="active",
        ),
        migrations.AddField(
            model_name="petitionoffenserecord",
            name="offense_record",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="petition.OffenseRecord"
            ),
        ),
        migrations.AddField(
            model_name="petitionoffenserecord",
            name="petition",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="petition.Petition"
            ),
        ),
        migrations.CreateModel(
            name="PetitionDocument",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "offense_records",
                    models.ManyToManyField(related_name="documents", to="petition.OffenseRecord"),
                ),
                (
                    "petition",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="documents",
                        to="petition.Petition",
                    ),
                ),
                (
                    "previous_document",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="petition.PetitionDocument",
                        null=True,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="petition",
            name="offense_records",
            field=models.ManyToManyField(
                related_name="petitions",
                through="petition.PetitionOffenseRecord",
                to="petition.OffenseRecord",
            ),
        ),
    ]
