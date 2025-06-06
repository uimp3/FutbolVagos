from django.shortcuts import render, redirect
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseRedirect
from django.conf import settings
from jose import jwt
from jose.exceptions import JWTError

from FutbolVagos.authentication import KeycloakAuthentication
from .models import Cliente, Sede, Cancha, Reservacion, Factura, Trabajador
from .serializers import ClienteSerializer, SedeSerializer, CanchaSerializer, ReservacionSerializer, FacturaSerializer, TrabajadorSerializer
from .utils import keycloak_protect

from drf_yasg.utils import swagger_auto_schema 

def check_auth_and_redirect(request):
    """
    Vista que verifica si el usuario está autenticado y redirige según corresponda.
    Si está autenticado, redirige a la página principal.
    Si no está autenticado, redirige al login de Keycloak.
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split('Bearer ')[-1]
        try:
            # Validar el token
            public_key = settings.KEYCLOAK_CONFIG['PUBLIC_KEY'].strip()
            if not public_key.startswith('-----BEGIN PUBLIC KEY-----'):
                public_key = f"-----BEGIN PUBLIC KEY-----\n{public_key}\n-----END PUBLIC KEY-----"
            
            jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                options={
                    "verify_signature": True,
                    "verify_exp": True,
                    "verify_aud": False
                }
            )
            # Si el token es válido, redirigir a la página principal
            return HttpResponseRedirect('http://localhost:4200/')
        except JWTError:
            pass
    
    # Si no hay token o es inválido, redirigir al login de Keycloak
    keycloak_url = f"{settings.KEYCLOAK_CONFIG['SERVER_URL']}/realms/{settings.KEYCLOAK_CONFIG['REALM']}/protocol/openid-connect/auth"
    redirect_uri = "http://localhost:4200/"
    client_id = settings.KEYCLOAK_CONFIG['CLIENT_ID']
    
    auth_url = f"{keycloak_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=openid"
    return HttpResponseRedirect(auth_url)

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    authentication_classes = [KeycloakAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Lista de todos los clientes registrados en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todos los clientes registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class SedeViewSet(viewsets.ModelViewSet):
    queryset = Sede.objects.all()
    serializer_class = SedeSerializer
    authentication_classes = [KeycloakAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Lista de todas las sedes disponibles en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las sedes registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Cancha.objects.all()
    serializer_class = CanchaSerializer
    authentication_classes = [KeycloakAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Lista de todas las canchas disponibles en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las canchas registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all()
    serializer_class = ReservacionSerializer
    authentication_classes = [KeycloakAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Lista de todas las reservaciones registradas en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las reservaciones registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    authentication_classes = [KeycloakAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Lista de todas las facturas registradas en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las facturas registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer
    authentication_classes = [KeycloakAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Lista de todos los trabajadores registrados en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todos los trabajadores registrados en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs) 