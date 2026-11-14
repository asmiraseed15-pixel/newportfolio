

from django.urls import path

from .views import (
    PortfolioContentAPIView,
    ProjectListAPIView,
    SkillListAPIView,
    ContactMessageCreateAPIView,
)

urlpatterns = [
    path(
        "portfolio/",
        PortfolioContentAPIView.as_view(),
        name="portfolio-content",
    ),

    path(
        "projects/",
        ProjectListAPIView.as_view(),
        name="project-list",
    ),

    path(
        "skills/",
        SkillListAPIView.as_view(),
        name="skill-list",
    ),

    path(
        "contact/",
        ContactMessageCreateAPIView.as_view(),
        name="contact-create",
    ),
]
