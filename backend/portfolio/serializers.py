


from rest_framework import serializers

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


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "created_at",
            "is_read",
        ]
        read_only_fields = ["id", "created_at", "is_read"]


class PortfolioProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioProfile
        fields = "__all__"

    def get_profile_image(self, obj):
        if obj.profile_image:
            request = self.context.get("request")
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return None


class AboutContentSerializer(serializers.ModelSerializer):
    voice_audio = serializers.SerializerMethodField()

    class Meta:
        model = AboutContent
        fields = "__all__"

    def get_voice_audio(self, obj):
        if obj.voice_audio:
            request = self.context.get("request")
            url = obj.voice_audio.url
            return request.build_absolute_uri(url) if request else url
        return None


class ProjectSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"


class PortfolioDocumentSerializer(serializers.ModelSerializer):
    preview_image = serializers.SerializerMethodField()
    file = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioDocument
        fields = "__all__"

    def get_preview_image(self, obj):
        if obj.preview_image:
            request = self.context.get("request")
            url = obj.preview_image.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_file(self, obj):
        if obj.file:
            request = self.context.get("request")
            url = obj.file.url
            return request.build_absolute_uri(url) if request else url
        return None


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"
