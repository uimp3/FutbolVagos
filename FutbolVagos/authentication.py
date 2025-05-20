from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from jose import jwt
from jose.exceptions import JWTError
import requests
import logging
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)

class KeycloakAuthentication(BaseAuthentication):
    def __init__(self):
        self.config = settings.KEYCLOAK_CONFIG
        self.public_key = self.config['PUBLIC_KEY'].strip()
        if not self.public_key.startswith('-----BEGIN PUBLIC KEY-----'):
            self.public_key = f"-----BEGIN PUBLIC KEY-----\n{self.public_key}\n-----END PUBLIC KEY-----"
        logger.info("KeycloakAuthentication initialized")

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split('Bearer ')[-1]
        logger.info("Processing token authentication")

        try:
            # Decodificar el token sin verificar para debug
            unverified_token = jwt.decode(
                token, 
                None, 
                options={
                    "verify_signature": False,
                    "verify_aud": False,
                    "verify_exp": False
                }
            )
            logger.debug("Token claims: %s", unverified_token)

            # Validar el token
            decoded_token = jwt.decode(
                token,
                self.public_key,
                algorithms=["RS256"],
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_aud": False  # Deshabilitamos la verificación de audiencia
                }
            )

            # Extraer información del usuario
            username = decoded_token.get('preferred_username')
            email = decoded_token.get('email')
            
            # Crear o actualizar usuario en Django
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'email': email}
            )

            # Almacenar el token decodificado en la request
            request.auth = decoded_token
            logger.info(f"Authentication successful for user: {username}")
            
            return (user, None)

        except JWTError as e:
            logger.error(f"JWT validation error: {str(e)}")
            raise AuthenticationFailed(f"Token inválido: {str(e)}")
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise AuthenticationFailed(f"Error de autenticación: {str(e)}")

    def authenticate_header(self, request):
        return 'Bearer realm="futbolvagos"' 