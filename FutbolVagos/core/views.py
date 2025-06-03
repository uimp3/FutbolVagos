from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from FutbolVagos.authentication import KeycloakAuthentication
from .models import Cliente, Sede, Cancha, Reservacion, Factura, Trabajador
from .serializers import ClienteSerializer, SedeSerializer, CanchaSerializer, ReservacionSerializer, FacturaSerializer, TrabajadorSerializer
from .utils import keycloak_protect

from drf_yasg.utils import swagger_auto_schema 

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Lista de todos los clientes registrados en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todos los clientes registradas en el sistema.",
        responses={200: ClienteSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Buscar clientes por cédula.",
        operation_description="Busca clientes por número de cédula.",
        responses={200: ClienteSerializer(many=True)},
    )
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        termino = request.query_params.get('q', '')
        if termino:
            clientes = Cliente.objects.filter(
                cedula__icontains=termino
            )
        else:
            clientes = Cliente.objects.all()
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)


class SedeViewSet(viewsets.ModelViewSet):
    queryset = Sede.objects.all()
    serializer_class = SedeSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Lista de todas las sedes disponibles en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las sedes registradas en el sistema.",
        responses={200: SedeSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Cancha.objects.all()
    serializer_class = CanchaSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Lista de todas las canchas disponibles en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las canchas registradas en el sistema.",
        responses={200: CanchaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Buscar canchas por término.",
        operation_description="Busca canchas por término en el nombre de la sede o estado.",
        responses={200: CanchaSerializer(many=True)},
    )
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        termino = request.query_params.get('q', '')
        if termino:
            canchas = Cancha.objects.filter(
                Q(sede__nombre__icontains=termino) |
                Q(estado__icontains=termino)
            )
        else:
            canchas = Cancha.objects.all()
        serializer = self.get_serializer(canchas, many=True)
        return Response(serializer.data)

# class HorarioViewSet(viewsets.ModelViewSet):
#     queryset = Horario.objects.all()
#     serializer_class = HorarioSerializer

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all()
    serializer_class = ReservacionSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Lista de todas las reservaciones registradas en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las reservaciones registradas en el sistema.",
        responses={200: ReservacionSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Buscar reservaciones por nombre de cliente.",
        operation_description="Busca reservaciones por el nombre del cliente.",
        responses={200: ReservacionSerializer(many=True)},
    )

    @action(detail=False, methods=['get'])
    def list_by_cliente(self, request, cliente_id=None):
        """
        Obtiene las reservaciones 'Confirmada' de un cliente específico.
        """
        if cliente_id is not None:
            # Filtra por cliente y estado 'Confirmada'
            # Si el estado "pendiente de pago" es diferente, ajusta 'Confirmada'.
            reservaciones = self.queryset.filter(cliente=cliente_id, estado='Confirmada')
            serializer = self.get_serializer(reservaciones, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "Debe proporcionar un ID de cliente."}, status=400)

    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        termino = request.query_params.get('q', '')
        if termino:
            reservaciones = Reservacion.objects.filter(
                cliente__nombre__icontains=termino
            )
        else:
            reservaciones = Reservacion.objects.all()
        serializer = self.get_serializer(reservaciones, many=True)
        return Response(serializer.data)

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Lista de todas las facturas registradas en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todas las facturas registradas en el sistema.",
        responses={200: FacturaSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Lista de todos los trabajadores registrados en la base de datos.", 
        operation_description="Este endpoint devuelve la lista de todos los trabajadores registrados en el sistema.",
        responses={200: TrabajadorSerializer(many=True)},  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Buscar trabajadores por cédula.",
        operation_description="Busca trabajadores por número de cédula.",
        responses={200: TrabajadorSerializer(many=True)},
    )
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        termino = request.query_params.get('q', '')
        if termino:
            trabajadores = Trabajador.objects.filter(
                cedula__icontains=termino
            )
        else:
            trabajadores = Trabajador.objects.all()
        serializer = self.get_serializer(trabajadores, many=True)
        return Response(serializer.data)