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
cd FutbolVagos/FutbolVagos
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

### **3. Uso de la web**



#### **a. Con “admin” de Django **
Primero se debe crear un superusuario, esto se hará con el comando:
```bash 
docker-compose exec web python manage.py createsuperuser
```
Una vez hecho eso ya se puede redirigir al url:
```bash
http://localhost:8000/admin/
```


Donde se puede digitar el usuario previamente creador


#### **b. Con “swagger” **
Se debe dirigir el usuario a la siguiente ruta
```bash
http://localhost:8000/api/swagger/
```


## **Capturas de los endpoints documentados**
Contamos con 6 models que llevan los diferentes tipos de endpoints:

Para canchas tenemos los siguientes endpoints:

![image](https://github.com/user-attachments/assets/1f992451-277d-4435-95f6-d8753c8678b4)


Para la parte de clientes se tiene los endpoints de:

![image](https://github.com/user-attachments/assets/1899e6a1-4883-4448-95f3-68ea417803cf)


Para Facturas contamos con los siguientes endpoints:

![image](https://github.com/user-attachments/assets/027de35a-bdee-433a-bac4-72dc54789c20)


Para reservaciones tenemos también los endpoints de:

![image](https://github.com/user-attachments/assets/7bff39bd-188d-4475-bea1-9869b7c5a379)


Para sedes contamos con los endpoints de:

![image](https://github.com/user-attachments/assets/639c9e17-2c67-4021-aa34-5246ad3f7da5)


Y por último los endpoints de los trabajadores son:

![image](https://github.com/user-attachments/assets/290cd393-a9f6-4d9d-ba6e-37e0805934fc)



---


## **Implementación de Keycloak**

Se descarga la imagen desde el repositorio

```bash
docker pull quay.io/keycloak/keycloak:latest 
```

Se inicia en contenedor

```bash
docker run -d --name keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```
