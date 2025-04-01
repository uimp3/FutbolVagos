# Generated by Django 5.1.7 on 2025-03-31 19:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cancha',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('precio_hora', models.DecimalField(decimal_places=2, max_digits=10)),
                ('capacidad_jugadores', models.IntegerField()),
                ('estado', models.CharField(choices=[('Disponible', 'Disponible'), ('En mantenimiento', 'En mantenimiento')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('cedula', models.CharField(max_length=50, unique=True)),
                ('telefono', models.CharField(max_length=20)),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True)),
                ('fecha_registro', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Sede',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('direccion', models.CharField(max_length=255)),
                ('barrio', models.CharField(blank=True, max_length=100, null=True)),
                ('ciudad', models.CharField(max_length=100)),
                ('horario_apertura', models.TimeField()),
                ('horario_cierre', models.TimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Reservacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('hora', models.TimeField()),
                ('estado', models.CharField(choices=[('Confirmada', 'Confirmada'), ('Cancelada', 'Cancelada'), ('Pagada', 'Pagada')], max_length=50)),
                ('monto_total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('cancha', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.cancha')),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.cliente')),
            ],
        ),
        migrations.CreateModel(
            name='Factura',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_emision', models.DateField(auto_now_add=True)),
                ('subtotal', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('impuestos', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('metodo_pago', models.CharField(choices=[('Efectivo', 'Efectivo'), ('Tarjeta', 'Tarjeta'), ('Transferencia', 'Transferencia')], max_length=50)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.cliente')),
                ('reservacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.reservacion')),
            ],
        ),
        migrations.AddField(
            model_name='cancha',
            name='sede',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.sede'),
        ),
        migrations.CreateModel(
            name='Trabajador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('cargo', models.CharField(choices=[('Administrador', 'Administrador'), ('Mantenimiento', 'Mantenimiento'), ('Recepcionista', 'Recepcionista'), ('Vigilante', 'Vigilante')], max_length=100)),
                ('cedula', models.CharField(max_length=20, unique=True)),
                ('telefono', models.CharField(blank=True, max_length=15, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('salario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('sede', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.sede')),
            ],
            options={
                'verbose_name': 'Trabajador',
                'verbose_name_plural': 'Trabajadores',
            },
        ),
    ]
