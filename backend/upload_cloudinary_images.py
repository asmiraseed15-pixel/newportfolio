import os
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from django.conf import settings
from django.core.files.base import ContentFile
from portfolio.models import Project, PortfolioDocument


def upload_images(queryset, field_name, label):
    for obj in queryset:
        image = getattr(obj, field_name)

        if not image:
            continue

        old_name = image.name

        if old_name.startswith("media/"):
            print("Already uploaded:", old_name)
            continue

        local_path = Path(settings.MEDIA_ROOT) / old_name

        if not local_path.exists():
            print("LOCAL FILE MISSING:", old_name)
            continue

        new_name = image.storage.save(
            old_name,
            ContentFile(local_path.read_bytes())
        )

        image.name = new_name
        obj.save(update_fields=[field_name])

        print("Uploaded:", label, old_name, "=>", new_name)


upload_images(Project.objects.all(), "image", "PROJECT")

upload_images(
    PortfolioDocument.objects.all(),
    "preview_image",
    "DOCUMENT PREVIEW"
)

print("IMAGE UPLOAD PROCESS COMPLETED")
