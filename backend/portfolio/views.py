


import json
import os
import urllib.request
import urllib.error

from django.conf import settings

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

        projects = Project.objects.filter(is_active=True)
        skills = Skill.objects.filter(is_active=True)
        experiences = Experience.objects.filter(is_active=True)
        education = Education.objects.filter(is_active=True)
        documents = PortfolioDocument.objects.filter(is_active=True)
        services = Service.objects.filter(is_active=True)

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


# Contact Form API - Resend Email Integration
class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):

        # Validate contact form data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save message in database first
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
            # Get Resend API key
            api_key = os.getenv("RESEND_API_KEY", "")

            if not api_key:
                raise ValueError(
                    "RESEND_API_KEY is missing in environment variables."
                )

            # Prepare email data
            email_data = {
                "from": "onboarding@resend.dev",
                "to": [settings.CONTACT_EMAIL],
                "subject": email_subject,
                "text": email_message,
            }

            if email:
                email_data["reply_to"] = email

            # Create Resend API request
            payload = json.dumps(email_data).encode("utf-8")

            api_request = urllib.request.Request(
                url="https://api.resend.com/emails",
                data=payload,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )

            # Send email through Resend
            with urllib.request.urlopen(
                api_request, timeout=20
            ) as response:

                result = json.loads(
                    response.read().decode("utf-8")
                )

                print("RESEND EMAIL SUCCESS:", result)

            return Response(
                {
                    "success": True,
                    "email_sent": True,
                    "message": (
                        "Your message has been sent successfully!"
                    ),
                },
                status=status.HTTP_201_CREATED,
            )

        except urllib.error.HTTPError as error:

            error_details = error.read().decode(
                "utf-8", errors="replace"
            )

            print("RESEND API ERROR:", error.code, error_details)

        except Exception as error:

            print("RESEND EMAIL ERROR:", repr(error))

        # Message is already saved in database
        return Response(
            {
                "success": True,
                "email_sent": False,
                "message": (
                    "Your message was saved, "
                    "but email delivery failed."
                ),
            },
            status=status.HTTP_201_CREATED,
        )
