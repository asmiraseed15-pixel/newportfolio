


import traceback

from django.conf import settings
from django.core.mail import EmailMessage

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    ContactMessage,
    PortfolioProfile,
    AboutContent,
    Project,
    Skill,
    Experience,
    Education,
    PortfolioDocument,
    Service,
)

from .serializers import (
    ContactMessageSerializer,
    PortfolioProfileSerializer,
    AboutContentSerializer,
    ProjectSerializer,
    SkillSerializer,
    ExperienceSerializer,
    EducationSerializer,
    PortfolioDocumentSerializer,
    ServiceSerializer,
)


# Complete Portfolio API
class PortfolioContentAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        context = {"request": request}

        profile = PortfolioProfile.objects.filter(
            is_active=True
        ).first()

        about = AboutContent.objects.filter(
            is_active=True
        ).first()

        projects = Project.objects.filter(
            is_active=True
        )

        skills = Skill.objects.filter(
            is_active=True
        )

        experiences = Experience.objects.filter(
            is_active=True
        )

        education = Education.objects.filter(
            is_active=True
        )

        documents = PortfolioDocument.objects.filter(
            is_active=True
        )

        services = Service.objects.filter(
            is_active=True
        )

        data = {
            "profile": (
                PortfolioProfileSerializer(
                    profile, context=context
                ).data if profile else None
            ),

            "about": (
                AboutContentSerializer(
                    about, context=context
                ).data if about else None
            ),

            "projects": ProjectSerializer(
                projects, many=True, context=context
            ).data,

            "skills": SkillSerializer(
                skills, many=True, context=context
            ).data,

            "experiences": ExperienceSerializer(
                experiences, many=True, context=context
            ).data,

            "education": EducationSerializer(
                education, many=True, context=context
            ).data,

            "documents": PortfolioDocumentSerializer(
                documents, many=True, context=context
            ).data,

            "services": ServiceSerializer(
                services, many=True, context=context
            ).data,
        }

        return Response(data)


# Existing Projects API
class ProjectListAPIView(generics.ListAPIView):
    queryset = Project.objects.filter(
        is_active=True
    ).order_by("display_order", "id")

    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]


# Existing Skills API
class SkillListAPIView(generics.ListAPIView):
    queryset = Skill.objects.filter(
        is_active=True
    ).order_by("category", "display_order", "name")

    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


# Contact Form API
class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        name = serializer.validated_data.get("name", "")
        email = serializer.validated_data.get("email", "")
        subject = serializer.validated_data.get(
            "subject", "New Portfolio Message"
        )
        message = serializer.validated_data.get("message", "")

        email_subject = f"Portfolio Contact: {subject}"

        email_message = f"""
You have received a new message from your portfolio website.

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""

        try:
            email_obj = EmailMessage(
                subject=email_subject,
                body=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_EMAIL],
                reply_to=[email] if email else [],
            )

            email_obj.send(fail_silently=False)

            return Response(
                {
                    "success": True,
                    "email_sent": True,
                    "message": "Your message has been sent successfully!",
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as error:
            print("CONTACT EMAIL ERROR:", repr(error))
            traceback.print_exc()

            return Response(
                {
                    "success": True,
                    "email_sent": False,
                    "message": "Your message was saved, but email delivery failed.",
                },
                status=status.HTTP_201_CREATED,
            )
