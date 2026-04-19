from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

USERNAME = 'admin'
EMAIL = 'admin@epiidosisglobalfin.com'
PASSWORD = 'SarkUSA78#34'

U = get_user_model()
u, created = U.objects.get_or_create(username=USERNAME, defaults={'email': EMAIL})
u.email = EMAIL
u.is_superuser = True
u.is_staff = True
u.set_password(PASSWORD)
u.save()
token, _ = Token.objects.get_or_create(user=u)
print(('CREATED' if created else 'UPDATED') + f" TOKEN={token.key}")
