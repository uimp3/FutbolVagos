from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class Cliente(models.Model):
    nombre = models.CharField(max_length=255, null=False)
    cedula = models.CharField(max_length=50, unique=True, null=False)
    telefono = models.CharField(max_length=20, null=False)
    email = models.EmailField(unique=True, blank=True, null=True)
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre


class Sede(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)
    barrio = models.CharField(max_length=100, blank=True, null=True)
    ciudad = models.CharField(max_length=100)
    horario_apertura = models.TimeField()
    horario_cierre = models.TimeField()

    def __str__(self):
        return self.nombre


class Cancha(models.Model):
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE)
    precio_hora = models.DecimalField(max_digits=10, decimal_places=2)
    capacidad_jugadores = models.IntegerField()
    estado = models.CharField(max_length=50, choices=[("Disponible", "Disponible"), ("En mantenimiento", "En mantenimiento")])

    def __str__(self):
        return f"Cancha {self.id} - {self.estado}"


class Trabajador(models.Model):
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    ROLES_CHOICES = [("Administrador", "Administrador"), ("Mantenimiento", "Mantenimiento"), ("Recepcionista", "Recepcionista"), ("Vigilante", "Vigilante")]
    cargo = models.CharField(max_length=100, choices=ROLES_CHOICES,)
    cedula = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    salario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Trabajador'
        verbose_name_plural = 'Trabajadores'
        
    def __str__(self):
        return self.nombre

# class Horario(models.Model):
#     cancha = models.ForeignKey(Cancha, on_delete=models.CASCADE)
#     hora_inicio = models.TimeField()
#     hora_fin = models.TimeField()
#     dia_semana = models.CharField(max_length=20)
#     disponible = models.BooleanField(default=True)

#     def __str__(self):
#         return f"Horario {self.id} - {self.dia_semana}"


class Reservacion(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    cancha = models.ForeignKey(Cancha, on_delete=models.CASCADE)
    # horario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    # fecha = models.DateTimeField()
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=50, choices=[("Confirmada", "Confirmada"), ("Cancelada", "Cancelada"), ("Pagada", "Pagada")])
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservación {self.id} - {self.estado}"


class Factura(models.Model):
    reservacion = models.ForeignKey(Reservacion, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_emision = models.DateField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    impuestos = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=[("Efectivo", "Efectivo"), ("Tarjeta", "Tarjeta"), ("Transferencia", "Transferencia")])

    def __str__(self):
        return f"Factura {self.id} - Total: {self.total}"