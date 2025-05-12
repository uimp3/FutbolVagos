from rest_framework.authentication import BaseAuthentication
from keycloak import KeycloakOpenID
from django.contrib.auth.models import User
from rest_framework.exceptions import AuthenticationFailed

class KeycloakAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Obtén el token del encabezado Authorization
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split('Bearer ')[-1]

        # Configura Keycloak
        keycloak_openid = KeycloakOpenID(
            server_url="http://keycloak:8080/",
            client_id="django-backend",
            realm_name="futbolvagos",
        )

        try:
            # Decodifica y valida el token
            user_info = keycloak_openid.userinfo(token)
        except Exception as e:
            raise AuthenticationFailed(f"Invalid token: {e}")

        # Crea o recupera el usuario de Django
        user, created = User.objects.get_or_create(username=user_info['preferred_username'])

        return user, None
