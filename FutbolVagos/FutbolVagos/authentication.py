from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from jose import jwt
from jose.exceptions import JWTError
import requests
import logging

logger = logging.getLogger(__name__)

class KeycloakAuthentication(BaseAuthentication):
    def __init__(self):
        self.config = settings.KEYCLOAK_CONFIG
        # Asegurarnos de que la clave pública esté en el formato correcto
        self.public_key = self.config['PUBLIC_KEY'].strip()
        if not self.public_key.startswith('-----BEGIN PUBLIC KEY-----'):
            self.public_key = f"-----BEGIN PUBLIC KEY-----\n{self.public_key}\n-----END PUBLIC KEY-----"
        logger.info("KeycloakAuthentication initialized")

    def authenticate(self, request):
        # Obtener el token del encabezado Authorization
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split('Bearer ')[-1]
        logger.info("Processing token authentication")

        try:
            # Primero decodificar sin verificar para debug
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

            # Validar el token usando la clave pública
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

            # Verificar que el azp coincida con nuestro client_id
            if decoded_token.get('azp') != self.config['CLIENT_ID']:
                logger.error("Token azp does not match client_id. Expected %s, got %s", 
                           self.config['CLIENT_ID'], decoded_token.get('azp'))
                raise AuthenticationFailed("Invalid token: Unauthorized client")

            # Obtener el nombre de usuario del token
            username = decoded_token.get('preferred_username')
            if not username:
                logger.error("No username found in token")
                raise AuthenticationFailed("Invalid token: No username found")

            logger.info(f"Authentication successful for user: {username}")
            
            # Crear un objeto User simple con la información necesaria
            user = type('User', (), {
                'username': username,
                'email': decoded_token.get('email', ''),
                'is_authenticated': True,
                'token': decoded_token
            })

            return (user, None)

        except JWTError as e:
            logger.error("JWT validation error: %s", str(e))
            raise AuthenticationFailed(f"Invalid token: {str(e)}")
        except Exception as e:
            logger.error("Authentication error: %s", str(e))
            raise AuthenticationFailed(f"Authentication failed: {str(e)}")

    def authenticate_header(self, request):
        return 'Bearer realm="futbolvagos"'
