


from django.contrib import admin

from .models import (
    ContactMessage,
    PortfolioProfile,
    AboutContent,
    Skill,
    Project,
    Experience,
    Education,
    PortfolioDocument,
    Service,
)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "is_read")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "subject")
    list_editable = ("is_read",)
    ordering = ("-created_at",)


@admin.register(PortfolioProfile)
class PortfolioProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "email", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "role", "email")


@admin.register(AboutContent)
class AboutContentAdmin(admin.ModelAdmin):
    list_display = ("heading", "voice_title", "is_active")
    list_filter = ("is_active",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "proficiency",
        "icon",
        "display_order",
        "is_active",
    )
    list_filter = ("category", "is_active")
    search_fields = ("name", "category")
    list_editable = ("proficiency", "display_order", "is_active")
    ordering = ("category", "display_order", "name")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "technologies",
        "display_order",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active",)
    search_fields = ("title", "technologies")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "id")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organization",
        "section_label",
        "display_order",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("title", "organization")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "id")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "institution",
        "year",
        "display_order",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("title", "institution", "year")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "id")


@admin.register(PortfolioDocument)
class PortfolioDocumentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "document_type",
        "file_type",
        "display_order",
        "is_active",
    )
    list_filter = ("document_type", "file_type", "is_active")
    search_fields = ("title", "download_name")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "id")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "icon",
        "display_order",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "id")
