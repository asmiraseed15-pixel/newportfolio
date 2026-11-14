

from django.db import models


# 1. Contact Messages
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-created_at"]


# 2. Main Portfolio Profile / Hero / Contact / Footer
class PortfolioProfile(models.Model):
    name = models.CharField(max_length=150, default="Asmina Parveen")
    role = models.CharField(max_length=250, blank=True)
    greeting = models.CharField(max_length=100, blank=True)
    availability_text = models.CharField(max_length=150, blank=True)
    hero_description = models.TextField(blank=True)
    profile_image = models.ImageField(
        upload_to="portfolio/profile/", blank=True, null=True
    )

    hero_card_one = models.CharField(max_length=150, blank=True)
    hero_card_two = models.CharField(max_length=150, blank=True)

    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=150, blank=True)
    contact_intro = models.TextField(blank=True)

    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    footer_brand = models.CharField(max_length=150, blank=True)
    footer_description = models.TextField(blank=True)
    footer_links = models.JSONField(default=list, blank=True)
    copyright_text = models.CharField(max_length=250, blank=True)
    footer_credit = models.CharField(max_length=200, blank=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# 3. About Section and Voice Introduction
class AboutContent(models.Model):
    heading = models.CharField(max_length=200, blank=True)
    paragraphs = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    learning_heading = models.CharField(max_length=150, blank=True)
    learning_text = models.TextField(blank=True)
    voice_label = models.CharField(max_length=150, blank=True)
    voice_title = models.CharField(max_length=150, blank=True)
    voice_audio = models.FileField(
        upload_to="portfolio/voice/", blank=True, null=True
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.heading or "About Content"


# 4. Skills
class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    proficiency = models.PositiveIntegerField(default=0, blank=True)
    icon = models.CharField(max_length=100, blank=True, default="")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.category}"

    class Meta:
        ordering = ["category", "display_order", "name"]


# 5. Projects
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=500)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)

    icon = models.CharField(max_length=100, blank=True)
    features = models.JSONField(default=list, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["display_order", "id"]


# 6. Experience
class Experience(models.Model):
    section_label = models.CharField(max_length=150, blank=True)
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    period = models.CharField(max_length=100, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["display_order", "id"]


# 7. Education and Certifications
class Education(models.Model):
    category = models.CharField(max_length=150, blank=True)
    title = models.CharField(max_length=200)
    institution = models.CharField(max_length=200, blank=True)
    year = models.CharField(max_length=100, blank=True)
    details = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["display_order", "id"]


# 8. Resume / Degree / Medical Documents
class PortfolioDocument(models.Model):
    DOCUMENT_TYPES = [
        ("resume", "Resume"),
        ("degree", "Degree Certificate"),
        ("medical", "Medical Coding Certificate"),
    ]

    FILE_TYPES = [
        ("image", "Image"),
        ("pdf", "PDF"),
    ]

    document_type = models.CharField(
        max_length=30, choices=DOCUMENT_TYPES, unique=True
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    preview_image = models.ImageField(
        upload_to="portfolio/documents/previews/", blank=True, null=True
    )
    file = models.FileField(
        upload_to="portfolio/documents/files/", blank=True, null=True
    )
    file_type = models.CharField(
        max_length=10, choices=FILE_TYPES, default="image"
    )
    download_name = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["display_order", "id"]


# 9. Services
class Service(models.Model):
    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["display_order", "id"]
