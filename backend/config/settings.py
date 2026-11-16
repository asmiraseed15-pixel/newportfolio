

"""
Django settings for config project.
"""

from pathlib import Path
import os

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")


# ==================================================
# SECURITY
# ==================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-local-development-key"
)

DEBUG = os.getenv("DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
]

render_hostname = os.getenv("RENDER_EXTERNAL_HOSTNAME")
if render_hostname:
    ALLOWED_HOSTS.append(render_hostname)

extra_hosts = os.getenv("ALLOWED_HOSTS", "")
if extra_hosts:
    ALLOWED_HOSTS.extend(
        host.strip()
        for host in extra_hosts.split(",")
        if host.strip()
    )


# ==================================================
# APPLICATIONS
# ==================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",

    "cloudinary_storage",
    "cloudinary",

    "portfolio",
]


# ==================================================
# MIDDLEWARE
# ==================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ==================================================
# URL CONFIGURATION
# ==================================================

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ==================================================
# DATABASE
# ==================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=not DEBUG,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ==================================================
# PASSWORD VALIDATION
# ==================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ==================================================
# LANGUAGE AND TIME
# ==================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True
USE_TZ = True


# ==================================================
# STATIC FILES - WHITENOISE
# ==================================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# ==================================================
# CLOUDINARY CONFIGURATION
# ==================================================

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
    "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
    "SECURE": True,
}


# ==================================================
# MEDIA FILES - CLOUDINARY
# ==================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# ==================================================
# FILE STORAGE
# ==================================================

STORAGES = {
    "default": {
        "BACKEND": (
            "cloudinary_storage.storage.MediaCloudinaryStorage"
        ),
    },

    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage."
            "CompressedManifestStaticFilesStorage"
        ),
    },
}


# ==================================================
# EMAIL CONFIGURATION
# ==================================================

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = os.getenv(
    "EMAIL_HOST",
    "smtp.gmail.com"
)

EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))

EMAIL_USE_TLS = os.getenv(
    "EMAIL_USE_TLS",
    "True"
).lower() == "true"

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")

EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    EMAIL_HOST_USER or ""
)

CONTACT_EMAIL = os.getenv(
    "CONTACT_EMAIL",
    EMAIL_HOST_USER or ""
)


# ==================================================
# RESEND EMAIL CONFIGURATION
# ==================================================

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")

RESEND_FROM_EMAIL = os.getenv(
    "RESEND_FROM_EMAIL",
    "onboarding@resend.dev"
)


# ==================================================
# CORS CONFIGURATION
# ==================================================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

frontend_url = os.getenv("FRONTEND_URL", "").strip()

if frontend_url:
    CORS_ALLOWED_ORIGINS.append(
        frontend_url.rstrip("/")
    )

extra_cors_origins = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    ""
)

if extra_cors_origins:
    CORS_ALLOWED_ORIGINS.extend(
        origin.strip().rstrip("/")
        for origin in extra_cors_origins.split(",")
        if origin.strip()
    )

CORS_ALLOW_CREDENTIALS = True


# ==================================================
# CSRF CONFIGURATION
# ==================================================

CSRF_TRUSTED_ORIGINS = list(CORS_ALLOWED_ORIGINS)


# ==================================================
# DJANGO REST FRAMEWORK
# ==================================================

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],

    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
}


# ==================================================
# PRODUCTION SECURITY
# ==================================================

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)

if not DEBUG:
    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"


# ==================================================
# DEFAULT PRIMARY KEY
# ==================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
