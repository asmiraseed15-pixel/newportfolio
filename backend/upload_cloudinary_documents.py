import os
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from django.conf import settings
from django.core.files.base import ContentFile
from portfolio.models import PortfolioDocument, AboutContent


def upload_file(field_file, obj, field_name, label):
    if not field_file:
        return

    old_name = field_file.name

    if old_name.startswith("media/"):
        print("Already uploaded:", old_name)
        return

    local_path = Path(settings.MEDIA_ROOT) / old_name

    if not local_path.exists():
        print("LOCAL FILE MISSING:", old_name)
        return

    new_name = field_file.storage.save(
        old_name,
        ContentFile(local_path.read_bytes())
    )

    field_file.name = new_name
    obj.save(update_fields=[field_name])

    print("Uploaded:", label, old_name, "=>", new_name)


for document in PortfolioDocument.objects.all():
    upload_file(
        document.file,
        document,
        "file",
        document.title
    )

for about in AboutContent.objects.all():
    upload_file(
        about.voice_audio,
        about,
        "voice_audio",
        "VOICE AUDIO"
    )

print("PDF AND AUDIO UPLOAD PROCESS COMPLETED")
