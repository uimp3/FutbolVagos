from rest_framework import serializers
from .models import Cliente, Sede, Cancha, Reservacion, Factura, Trabajador

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'

class CanchaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancha
        fields = '__all__'

# class HorarioSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Horario
#         fields = '__all__'

class ReservacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservacion
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'