from jose import jwt
from jose.exceptions import JWTError
from django.http import JsonResponse
import requests

from django.conf import settings

def validate_token(token):
    public_key = settings.KEYCLOAK_PUBLIC_KEY
    try:
        decoded = jwt.decode(token, public_key, algorithms=["RS256"], audience="django-backend")
        return decoded
    except jwt.JWTError as e:
        raise Exception(f"Token inválido: {e}")

class KeycloakMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                validate_token(token)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=401)
        return self.get_response(request)