# Usamos la imagen oficial de Python
FROM python:3.11-slim

# Instalamos las dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app/FutbolVagos

# Copiamos los archivos de requerimientos
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copiamos el resto del código
COPY . /app/

# Exponemos el puerto en el que correrá la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
