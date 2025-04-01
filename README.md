# FutbolVagos


FutbolVagos es una aplicación web diseñada para gestionar la reserva de canchas deportivas. Permite a los usuarios registrar clientes, administrar sedes, horarios y realizar reservaciones. El proyecto está desarrollado en **Django** y utiliza **PostgreSQL** como base de datos. Además, está dockerizado para facilitar su despliegue.


---


## **Características**
- Gestión de clientes: Registro, actualización y eliminación de clientes.
- Administración de sedes y canchas deportivas.
- Reservación de canchas con horarios específicos.
- API RESTful para interactuar con los datos.
- Interfaz de administración de Django para gestionar el sistema.
- Uso de Docker para un despliegue rápido y consistente.


---


## **Tecnologías Utilizadas**
- **Backend**: Django 5.0, Django REST Framework
- **Base de Datos**: PostgreSQL
- **Contenedores**: Docker y Docker Compose
- **Lenguaje**: Python 3.12


---


## **Requisitos Previos**
Antes de comenzar, asegúrate de tener instalados los siguientes programas:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)


---
## **Instrucciones de Despliegue**


### **1. Clonar el Repositorio**
Clona este repositorio en tu máquina local:
```bash
git clone https://github.com/uimp3/FutbolVagos.git
```



Luego dirígete a esta ruta
```bash
cd FutbolVagos
```

### **2. Construir contenedores en docker**
Si es la primera vez que estas ejecutando el proyecto, debes construir los contenedores:
```bash
docker-compose up --build -d
```
Si ya tienes las imágenes descargadas previamente si las acabas de crear ejecuta este comando:
```bash
docker-compose up -d
```
