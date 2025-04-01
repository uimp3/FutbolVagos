# Usamos la imagen oficial de Python
FROM python:3.11

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de requerimientos y los instalamos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos todo el proyecto dentro del contenedor
COPY . .

# Exponemos el puerto 8000 para Django
EXPOSE 8000

# Comando por defecto al iniciar el contenedor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
