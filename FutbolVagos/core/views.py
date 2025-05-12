from django.shortcuts import render
from rest_framework import viewsets

from FutbolVagos.core.authentication import KeycloakAuthentication
from .models import Cliente, Sede, Cancha, Reservacion, Factura, Trabajador
from .serializers import ClienteSerializer, SedeSerializer, CanchaSerializer, ReservacionSerializer, FacturaSerializer, TrabajadorSerializer
from .utils import keycloak_protect

from drf_yasg.utils import swagger_auto_schema 

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    @swagger_auto_schema(
        operation_summary="Lista de todos los clientes registrados en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todos los clientes registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    @keycloak_protect
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class SedeViewSet(viewsets.ModelViewSet):
    queryset = Sede.objects.all()
    serializer_class = SedeSerializer
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

    @swagger_auto_schema(
        operation_summary="Lista de todas las canchas disponibles en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las canchas registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
       
        return super().list(request, *args, **kwargs)

# class HorarioViewSet(viewsets.ModelViewSet):
#     queryset = Horario.objects.all()
#     serializer_class = HorarioSerializer

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all()
    serializer_class = ReservacionSerializer

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

    @swagger_auto_schema(
        operation_summary="Lista de todos los trabajadores registrados en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todos los trabajadores registrados en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
       
        return super().list(request, *args, **kwargs)