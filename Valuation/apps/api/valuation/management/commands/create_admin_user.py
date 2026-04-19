from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

class Command(BaseCommand):
    help = "Create or update a superuser with token."

    def add_arguments(self, parser):
        parser.add_argument("--username", required=True)
        parser.add_argument("--email", required=True)
        parser.add_argument("--password", required=True)

    def handle(self, *args, **opts):
        username = opts["username"]
        email = opts["email"]
        password = opts["password"]
        U = get_user_model()
        user, created = U.objects.get_or_create(username=username, defaults={"email": email})
        user.email = email
        user.is_superuser = True
        user.is_staff = True
        user.set_password(password)
        user.save()
        token, _ = Token.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS(("CREATED" if created else "UPDATED") + f" TOKEN={token.key}"))
