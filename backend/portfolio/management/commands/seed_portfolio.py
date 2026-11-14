from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.files import File

from portfolio.models import (
    PortfolioProfile,
    AboutContent,
    Project,
    Experience,
    Education,
    PortfolioDocument,
    Service,
)


class Command(BaseCommand):
    help = "Populate portfolio content and upload existing public assets"

    def handle(self, *args, **options):

        # Frontend public folder
        PUBLIC = Path(__file__).resolve().parents[4] / "public"
        def asset(filename):
            path = PUBLIC / filename
            if not path.exists():
                self.stdout.write(self.style.WARNING(
                    f"Asset not found: {filename}"
                ))
                return None
            return path

        def upload(instance, field_name, filename):
            path = asset(filename)
            if path:
                with path.open("rb") as file:
                    getattr(instance, field_name).save(
                        filename, File(file), save=False
                    )

        # 1. PROFILE
        profile = PortfolioProfile.objects.filter(is_active=True).first()

        if profile is None:
            profile = PortfolioProfile()

        profile.name = "Asmina Parveen"
        profile.role = "Full Stack Developer & Medical Coding Professional"
        profile.greeting = "HELLO, I'M"
        profile.availability_text = "Available for opportunities"
        profile.hero_description = (
            "I build responsive and user-friendly web applications using "
            "React, TypeScript, Python and Django. I work across frontend "
            "development, backend APIs and databases, while bringing a "
            "professional background in Microbiology, Medical Coding and "
            "customer service."
        )
        profile.hero_card_one = "Full Stack Developer"
        profile.hero_card_two = "Medical Coder"
        profile.email = "asmiraseed15@gmail.com"
        profile.phone = "+91 93444 18518"
        profile.location = "Puducherry, India"
        profile.contact_intro = (
            "Have a project, opportunity or simply want to connect? "
            "I'd love to hear from you."
        )
        profile.github_url = "https://github.com/asmiraseed15-pixel"
        profile.linkedin_url = (
            "https://www.linkedin.com/in/asmi-raseed-160320436/"
        )
        profile.footer_brand = "Asmina Parveen"
        profile.footer_description = (
            "Full Stack Developer & Medical Coding Professional."
        )
        profile.footer_links = [
            {"label": "Home", "url": "#home"},
            {"label": "About", "url": "#about"},
            {"label": "Skills", "url": "#skills"},
            {"label": "Projects", "url": "#projects"},
            {"label": "Contact", "url": "#contact"},
        ]
        profile.copyright_text = (
            "© 2026 Asmina Parveen. All rights reserved."
        )
        profile.footer_credit = "Designed & Built with React"
        profile.is_active = True

        if not profile.profile_image:
            upload(profile, "profile_image", "pro.png")

        profile.save()

        # 2. ABOUT
        about = AboutContent.objects.filter(is_active=True).first()

        if about is None:
            about = AboutContent()

        about.heading = "About Me"
        about.paragraphs = [
            "I am Asmina Parveen, an aspiring Full Stack Developer and "
            "Medical Coding Professional who enjoys combining technology, "
            "creativity and attention to detail.",
            "With a background in B.Sc Microbiology and Medical Coding, "
            "along with professional BPO experience, I bring strong "
            "communication, problem-solving and analytical skills into "
            "my development journey.",
            "I enjoy building responsive web applications, working with "
            "frontend interfaces, backend development, REST APIs and "
            "databases to create complete and meaningful digital experiences."
        ]
        about.tags = [
            "Frontend", "React", "TypeScript", "Python", "Django",
            "REST API", "SQL", "Medical Coding", "Communication"
        ]
        about.learning_heading = "Always learning."
        about.learning_text = (
            "Currently improving my skills in Django, REST APIs, databases "
            "and AI / Generative AI technologies."
        )
        about.voice_label = "LISTEN TO MY INTRODUCTION"
        about.voice_title = "My Voice"

        if not about.voice_audio:
            upload(about, "voice_audio", "Voice.mp3")

        about.is_active = True
        about.save()

        # 3. PROJECT ICONS AND FEATURES
        project_data = {
            "stepup": {
                "icon": "bi-cart3",
                "image": "pro.png",
                "features": [
                    "Product browsing", "Product categories",
                    "Product search and filtering", "Product details and images",
                    "Shopping cart", "Wishlist management",
                    "User login and registration", "Order placement",
                    "Checkout", "Payment integration", "Order tracking",
                    "Admin product management", "Reviews and ratings",
                    "Responsive design"
                ],
            },
            "groco": {
                "icon": "bi-cart3",
                "image": "gro.png",
                "features": [
                    "Product browsing", "Product categories", "Product details",
                    "Shopping cart", "Quantity management",
                    "Coupon functionality", "Checkout flow", "Payment flow",
                    "Responsive design"
                ],
            },
            "hopehands": {
                "icon": "bi-heart-pulse",
                "image": "char.png",
                "features": [
                    "Responsive charity website", "Causes section",
                    "Donation flow", "Volunteer section", "Volunteer form",
                    "Thank-you page", "Impact section", "Community stories"
                ],
            },
            "foodflow": {
                "icon": "bi-phone",
                "image": "food.png",
                "features": [
                    "Authentication", "Login and signup", "Food browsing",
                    "Shopping cart", "Cart quantity management", "Checkout",
                    "Address management", "Payment selection",
                    "Mobile-friendly experience"
                ],
            },
            "photography": {
                "icon": "bi-camera",
                "image": "photo.png",
                "features": [
                    "Responsive photography portfolio", "Modern landing page",
                    "Photography gallery", "Bootstrap responsive layout",
                    "Image showcase", "Interactive navigation",
                    "JavaScript functionality", "Mobile-friendly design"
                ],
            },
            "to do list": {
                "icon": "bi-check2-square",
                "image": "todo.png",
                "features": [
                    "Daily task management", "Create and organize tasks",
                    "Health activity tracking", "Financial updates",
                    "Custom reminders", "Task status tracking",
                    "Daily productivity management",
                    "User-friendly mobile interface"
                ],
            },
            "vetrix": {
                "icon": "bi-mortarboard",
                "image": "vetrix.png",
                "features": [
                    "Learn 7 different languages",
                    "Interactive language learning",
                    "Songs and entertainment", "Fun games and activities",
                    "Interactive quizzes", "Multiple online courses",
                    "Mock interview practice", "Professional skill development",
                    "Learning and progress improvement"
                ],
            },
            "supplyhive": {
                "icon": "bi-bag",
                "image": "supplyhive.png",
                "features": [
                    "Online stationery shopping",
                    "Stationery product browsing", "Product categories",
                    "Product details", "Stationery essentials management",
                    "User-friendly shopping interface", "Responsive design"
                ],
            },
        }

        for project in Project.objects.all():
            title = project.title.lower()
            matched = None

            for keyword, data in project_data.items():
                if keyword in title:
                    matched = data
                    break

            if matched:
                project.icon = matched["icon"]
                project.features = matched["features"]

                if not project.image:
                    upload(project, "image", matched["image"])

                project.save()

        # 4. EXPERIENCE
        experience_data = [
            {
                "section_label": "PROFESSIONAL EXPERIENCE",
                "title": "BPO / Customer Service",
                "organization": "Insuremile Insurance Company",
                "description": (
                    "Developed strong communication, customer handling, "
                    "documentation and problem-solving skills through "
                    "professional experience."
                ),
            },
            {
                "section_label": "CURRENT LEARNING",
                "title": "Full Stack, Backend & AI Development",
                "organization": "Continuous Skill Development",
                "description": (
                    "Building practical projects with React, Python, Django "
                    "and REST APIs while exploring databases, Machine "
                    "Learning, Deep Learning and Generative AI."
                ),
            },
        ]

        for index, item in enumerate(experience_data):
            Experience.objects.update_or_create(
                title=item["title"],
                defaults={**item, "display_order": index}
            )

        # 5. EDUCATION
        education_data = [
            {
                "category": "DEGREE",
                "title": "B.Sc Microbiology",
                "institution": "Annamalai University",
                "year": "2024",
                "details": "",
                "icon": "bi-mortarboard",
            },
            {
                "category": "CERTIFICATION",
                "title": "Medical Coding",
                "institution": "Professional Certification",
                "year": "Medical Coding Training",
                "details": "",
                "icon": "bi-award",
            },
            {
                "category": "CURRENT LEARNING",
                "title": "Full Stack & AI Development",
                "institution": "Currently Learning",
                "year": "",
                "details": (
                    "Django, REST API, SQL, PostgreSQL, MongoDB, AI, ML, "
                    "Deep Learning, LLM, LangChain Memory, RAG & Pinecone"
                ),
                "icon": "bi-code-slash",
            },
        ]

        for index, item in enumerate(education_data):
            Education.objects.update_or_create(
                title=item["title"],
                defaults={**item, "display_order": index}
            )

        # 6. DOCUMENTS
        document_data = [
            {
                "document_type": "resume",
                "title": "Resume",
                "description": "My professional resume",
                "preview": "resumepdf.png",
                "file": "AP Resume.pdf",
                "download_name": "Asmina_Resume.pdf",
                "file_type": "pdf",
            },
            {
                "document_type": "degree",
                "title": "Degree Certificate",
                "description": "B.Sc Microbiology degree certificate",
                "preview": "convocation.png",
                "file": "degree.png",
                "download_name": "Asmina_Degree.png",
                "file_type": "image",
            },
            {
                "document_type": "medical",
                "title": "Medical Coding Certificate",
                "description": "Medical Coding certification",
                "preview": "coding.png",
                "file": "medical.png",
                "download_name": "Asmina_Medical_Coding.png",
                "file_type": "image",
            },
        ]

        for index, item in enumerate(document_data):
            document, created = PortfolioDocument.objects.get_or_create(
                document_type=item["document_type"],
                defaults={
                    "title": item["title"],
                    "description": item["description"],
                    "file_type": item["file_type"],
                    "download_name": item["download_name"],
                    "display_order": index,
                    "is_active": True,
                }
            )

            document.title = item["title"]
            document.description = item["description"]
            document.file_type = item["file_type"]
            document.download_name = item["download_name"]
            document.display_order = index
            document.is_active = True

            if not document.preview_image:
                upload(document, "preview_image", item["preview"])

            if not document.file:
                upload(document, "file", item["file"])

            document.save()

        # 7. SERVICES
        service_data = [
            {
                "title": "Full Stack Development",
                "icon": "bi-window-stack",
                "description": (
                    "Building complete web applications with responsive "
                    "frontend interfaces, backend functionality and "
                    "database integration."
                ),
            },
            {
                "title": "React Development",
                "icon": "bi-code-square",
                "description": (
                    "Building reusable React components and interactive "
                    "application interfaces."
                ),
            },
            {
                "title": "Backend & API Development",
                "icon": "bi-database",
                "description": (
                    "Developing backend functionality using Python, Django, "
                    "REST APIs and database technologies."
                ),
            },
        ]

        for index, item in enumerate(service_data):
            Service.objects.update_or_create(
                title=item["title"],
                defaults={**item, "display_order": index}
            )

        self.stdout.write(self.style.SUCCESS(
            "Portfolio content seeded successfully!"
        ))
        self.stdout.write(
            "Existing projects preserved. Skills need to be added separately."
        )