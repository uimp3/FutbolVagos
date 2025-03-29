from django.contrib import admin
from .models import Cliente, Sede, Cancha, Trabajador, Horario

admin.site.register(Cliente)
admin.site.register(Sede)
admin.site.register(Cancha)
admin.site.register(Trabajador)
admin.site.register(Horario)