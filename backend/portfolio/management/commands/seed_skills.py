
from django.core.management.base import BaseCommand
from portfolio.models import Skill


class Command(BaseCommand):
    help = "Add portfolio skills"

    def handle(self, *args, **options):

        skills_data = [
            # FRONTEND
            ("HTML", "Frontend", 90, "bi bi-filetype-html"),
            ("CSS", "Frontend", 85, "bi bi-filetype-css"),
            ("JavaScript", "Frontend", 80, "bi bi-filetype-js"),
            ("TypeScript", "Frontend", 75, "bi bi-filetype-tsx"),
            ("React", "Frontend", 85, "bi bi-code-square"),
            ("React Native", "Frontend", 75, "bi bi-phone"),

            # BACKEND
            ("Python", "Backend", 80, "bi bi-filetype-py"),
            ("Django", "Backend", 75, "bi bi-server"),
            ("Django REST Framework", "Backend", 70, "bi bi-braces"),
            ("REST API", "Backend", 75, "bi bi-diagram-3"),

            # DATABASE
            ("SQLite", "Database", 80, "bi bi-database"),
            ("PostgreSQL", "Database", 70, "bi bi-database-fill"),
            ("MySQL", "Database", 65, "bi bi-database"),
            ("MongoDB", "Database", 60, "bi bi-database-check"),

            # AI & MACHINE LEARNING
            ("Machine Learning", "AI & Machine Learning", 55, "bi bi-robot"),
            ("Deep Learning", "AI & Machine Learning", 50, "bi bi-cpu"),
            ("Generative AI", "AI & Machine Learning", 55, "bi bi-stars"),
            ("LLM", "AI & Machine Learning", 50, "bi bi-chat-square-text"),
            ("RAG", "AI & Machine Learning", 50, "bi bi-diagram-3"),
            ("Pinecone", "AI & Machine Learning", 45, "bi bi-database"),

            # TOOLS & DEPLOYMENT
            ("Git", "Tools & Deployment", 80, "bi bi-git"),
            ("GitHub", "Tools & Deployment", 85, "bi bi-github"),
            ("VS Code", "Tools & Deployment", 85, "bi bi-code-slash"),
            ("Postman", "Tools & Deployment", 70, "bi bi-send"),
            ("Render", "Tools & Deployment", 70, "bi bi-cloud"),
            ("Vercel", "Tools & Deployment", 70, "bi bi-cloud-upload"),
        ]

        for index, (name, category, proficiency, icon) in enumerate(skills_data):
            Skill.objects.update_or_create(
                name=name,
                category=category,
                defaults={
                    "proficiency": proficiency,
                    "icon": icon,
                    "display_order": index,
                    "is_active": True,
                }
            )

        self.stdout.write(
            self.style.SUCCESS("Portfolio skills added successfully!")
        )
