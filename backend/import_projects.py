
from portfolio.models import Project

projects = [
    {
        "title": "GroCo",
        "description": "A modern grocery shopping website built with React and TypeScript with product browsing, cart, checkout and payment flow.",
        "technologies": "React, TypeScript, CSS",
        "github_url": None,
        "live_url": "https://groco-mu.vercel.app",
    },
    {
        "title": "HopeHands Foundation",
        "description": "A charity website designed to present causes, volunteering opportunities, donations and community impact in a clean responsive interface.",
        "technologies": "React, TypeScript, CSS",
        "github_url": None,
        "live_url": "https://charity1-one.vercel.app/",
    },
    {
        "title": "FoodFlow",
        "description": "A food delivery mobile application concept built with Expo and React Native with authentication, cart and checkout experiences.",
        "technologies": "React Native, Expo, JavaScript",
        "github_url": None,
        "live_url": None,
    },
    {
        "title": "Photography Portfolio",
        "description": "A stylish photography portfolio website created to showcase photographs through a clean, responsive and visually engaging interface.",
        "technologies": "HTML, CSS, Bootstrap, JavaScript",
        "github_url": None,
        "live_url": None,
    },
]

for project in projects:
    obj, created = Project.objects.update_or_create(
        title=project["title"],
        defaults=project,
    )

    if created:
        print(f"Added: {obj.title}")
    else:
        print(f"Already exists, updated: {obj.title}")

print("Project import completed!")
