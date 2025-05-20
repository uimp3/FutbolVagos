from jose import jwt
from jose.exceptions import JWTError
from django.http import JsonResponse
import requests
from django.conf import settings
from functools import wraps
import logging

logger = logging.getLogger(__name__)

def decode_token_without_verification(token):
    try:
        return jwt.decode(token, None, options={
            "verify_signature": False,
            "verify_aud": False,
            "verify_exp": False
        })
    except Exception as e:
        return {"error": str(e)}

def keycloak_protect(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Log all headers for debugging
        logger.debug("Request headers: %s", dict(request.headers))
        
        auth_header = request.headers.get("Authorization")
        logger.debug("Auth header: %s", auth_header)
        
        if not auth_header:
            logger.error("No Authorization header found")
            return JsonResponse({"error": "Authorization header missing"}, status=401)
        
        if not auth_header.startswith("Bearer "):
            logger.error("Authorization header does not start with 'Bearer '")
            return JsonResponse({"error": "Invalid Authorization header format. Must start with 'Bearer '"}, status=401)

        token = auth_header.split(" ")[1]
        logger.debug("Token extracted: %s", token[:50] + "...")  # Solo mostramos los primeros 50 caracteres del token
        
        # Decodificar el token sin verificar para debug
        decoded = decode_token_without_verification(token)
        logger.debug("Token decoded: %s", decoded)
        logger.debug("Expected client_id: %s", settings.KEYCLOAK_CONFIG["CLIENT_ID"])
        
        try:
            # Usar la clave pública directamente desde la configuración
            public_key = settings.KEYCLOAK_CONFIG['PUBLIC_KEY'].strip()
            if not public_key.startswith('-----BEGIN PUBLIC KEY-----'):
                public_key = f"-----BEGIN PUBLIC KEY-----\n{public_key}\n-----END PUBLIC KEY-----"
            
            logger.debug("Using public key: %s", public_key)

            decoded_token = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_aud": False  # Deshabilitamos la verificación de audiencia para ser consistentes
                }
            )
            
            # Agregar el token decodificado a la request para uso posterior si es necesario
            request.decoded_token = decoded_token
            logger.info("Token successfully validated in keycloak_protect decorator")
            
        except JWTError as e:
            logger.error("JWT validation error in decorator: %s", str(e))
            return JsonResponse({"error": f"Invalid or expired token: {str(e)}"}, status=401)
        except Exception as e:
            logger.error("Authentication error in decorator: %s", str(e))
            return JsonResponse({"error": f"Authentication error: {str(e)}"}, status=401)

        return view_func(request, *args, **kwargs)
    return wrapper
