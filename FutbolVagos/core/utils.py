from jose import jwt
from jose.exceptions import JWTError
from django.http import JsonResponse
import requests
from django.conf import settings

def keycloak_protect(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Authorization header missing or invalid"}, status=401)

        token = auth_header.split(" ")[1]
        try:
            # Obtener la clave pública de Keycloak
            jwks_url = f"{settings.KEYCLOAK_CONFIG['SERVER_URL']}/realms/{settings.KEYCLOAK_CONFIG['REALM']}/protocol/openid-connect/certs"
            jwks = requests.get(jwks_url).json()
            # Decodificar y validar el token
            jwt.decode(
                token,
                jwks,
                algorithms=["RS256"],
                audience=settings.KEYCLOAK_CONFIG["CLIENT_ID"],
            )
        except JWTError:
            return JsonResponse({"error": "Invalid or expired token"}, status=401)

        return view_func(request, *args, **kwargs)
    return wrapper
