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
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    
    class Meta:
        model = Cancha
        fields = ['id', 'sede', 'sede_nombre', 'precio_hora', 'capacidad_jugadores', 'estado']

# class HorarioSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Horario
#         fields = '__all__'

class ReservacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_cedula = serializers.CharField(source='cliente.cedula', read_only=True)
    cancha_nombre = serializers.CharField(source='cancha.id', read_only=True)
    sede_nombre = serializers.CharField(source='cancha.sede.nombre', read_only=True)
    
    class Meta:
        model = Reservacion
        fields = [
            'id', 
            'cliente',
            'cliente_nombre',
            'cliente_cedula',
            'cancha',
            'cancha_nombre',
            'sede_nombre',
            'fecha', 
            'hora', 
            'estado', 
            'monto_total', 
            'fecha_creacion'
        ]
        read_only_fields = ['fecha_creacion', 'cliente_nombre', 'cliente_cedula', 'cancha_nombre', 'sede_nombre']
        
    def validate(self, data):
        instance = self.instance
        
        cancha = data.get('cancha')
        fecha = data.get('fecha')
        hora = data.get('hora')
        
        if cancha and fecha and hora:
            # Verificar si la cancha está disponible
            if cancha.estado != 'Disponible':
                raise serializers.ValidationError("La cancha no está disponible para reservas.")
            
            # Verificar si ya existe una reserva para esa cancha, fecha y hora
            queryset = Reservacion.objects.filter(
                cancha=cancha, 
                fecha=fecha, 
                hora=hora,
                estado__in=['Confirmada', 'Pagada']  # Solo verificar reservas activas
            )

            if instance:
                queryset = queryset.exclude(pk=instance.pk)

            if queryset.exists():
                raise serializers.ValidationError("Ya existe una reserva para esta cancha en la misma fecha y hora.")
        
        return data

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'