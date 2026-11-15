from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from portfolio.models import (
    PortfolioProfile,
    Project,
    PortfolioDocument,
    AboutContent,
)


class Command(BaseCommand):
    help = "Update production portfolio media paths to Cloudinary files"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview changes without updating the database",
        )

    def update_field(self, model, filters, field, new_path):
        queryset = model.objects.filter(**filters)

        if queryset.count() != 1:
            raise CommandError(
                f"Expected exactly one {model.__name__} record: {filters}"
            )

        obj = queryset.first()
        current = getattr(obj, field).name

        if current == new_path:
            self.stdout.write(f"Already updated: {model.__name__}.{field}")
            return

        if self.dry_run:
            self.stdout.write(
                f"Would update {model.__name__}.{field}: "
                f"{current} -> {new_path}"
            )
        else:
            queryset.update(**{field: new_path})
            self.stdout.write(
                self.style.SUCCESS(
                    f"Updated {model.__name__}.{field}: "
                    f"{current} -> {new_path}"
                )
            )

    @transaction.atomic
    def handle(self, *args, **options):
        self.dry_run = options["dry_run"]

        if self.dry_run:
            self.stdout.write(
                self.style.WARNING("DRY RUN: No database changes will be saved.")
            )

        self.update_field(
            PortfolioProfile,
            {"pk": 1, "name": "Asmina Parveen"},
            "profile_image",
            "media/portfolio/profile/pro_bkznda",
        )

        projects = [
            (1, "StepUp Shoe Ecommerce", "media/projects/Screenshot_1745_yiuohg"),
            (2, "GroCo", "media/projects/groco_beajzx"),
            (3, "HopeHands Foundation", "media/projects/charity_wxrozc"),
            (4, "FoodFlow", "media/projects/food_fsaf7i"),
            (5, "Photography Portfolio", "media/projects/photo_bxwduu"),
            (6, "To Do List", "media/projects/todo_yyc3gm"),
            (7, "Vetrix Learning App", "media/projects/vetrix_p1nqh1"),
            (8, "Supplyhive Stationary Shop", "media/projects/supplyhive_igjfyn"),
        ]

        for pk, title, path in projects:
            self.update_field(
                Project,
                {"pk": pk, "title": title},
                "image",
                path,
            )

        documents = [
            (
                1, "resume",
                "media/portfolio/documents/previews/resumepdf_rbljvd",
                "media/portfolio/documents/files/Res_tl6eel.png",
            ),
            (
                2, "degree",
                "media/portfolio/documents/previews/convocation_vaabsg",
                "media/portfolio/documents/files/degree_db1drk.png",
            ),
            (
                3, "medical",
                "media/portfolio/documents/previews/coding_dodsxm",
                "media/portfolio/documents/files/medical_ghjix4.png",
            ),
        ]

        for pk, doc_type, preview, file_path in documents:
            filters = {"pk": pk, "document_type": doc_type}

            self.update_field(
                PortfolioDocument,
                filters,
                "preview_image",
                preview,
            )

            self.update_field(
                PortfolioDocument,
                filters,
                "file",
                file_path,
            )

        self.update_field(
            AboutContent,
            {"pk": 1},
            "voice_audio",
            "media/portfolio/voice/Voice_pfrp7c",
        )

        if self.dry_run:
            self.stdout.write(
                self.style.SUCCESS("Dry run completed. No changes were saved.")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("All portfolio media paths updated successfully.")
            )
