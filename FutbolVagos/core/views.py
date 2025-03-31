from django.shortcuts import render
from rest_framework import viewsets
from .models import Cliente, Sede, Cancha, Reservacion, Factura, Trabajador
from .serializers import ClienteSerializer, SedeSerializer, CanchaSerializer, ReservacionSerializer, FacturaSerializer, TrabajadorSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class SedeViewSet(viewsets.ModelViewSet):
    queryset = Sede.objects.all()
    serializer_class = SedeSerializer

class CanchaViewSet(viewsets.ModelViewSet):
    queryset = Cancha.objects.all()
    serializer_class = CanchaSerializer

# class HorarioViewSet(viewsets.ModelViewSet):
#     queryset = Horario.objects.all()
#     serializer_class = HorarioSerializer

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all()
    serializer_class = ReservacionSerializer

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer