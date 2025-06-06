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


### **2. Construir contenedores en docker**
Si es la primera vez que estas ejecutando el proyecto, debes construir los contenedores:
```bash
docker-compose up --build -d
```


Si ya tienes las imágenes descargadas previamente si las acabas de crear ejecuta este comando:
```bash
docker-compose up -d
```

### **3. Crear realm en Keycloak**
En el navegador se abre
```bash
http://localhost:8000/
```

(esperar a que cargue la imagen si inició el docker recién)
Dirigirse a Manage realms, Create realm. Luego, arrastrar o buscar donde clonó FutbolVagos el archivo realm-export.json  

---
En Users, crear un nuevo usuario
![image](https://github.com/user-attachments/assets/de9499e6-d782-4e63-8fda-978b39516844)

Guardar y dirigirse a Credentials, set password, configurar una contraseña y desactivar el temporary

---
Finalizar configuraciones:
Ir a Clients, django-backend, Credentials, Regenerar y copiar el client secret.
En el proyecto clonado reemplazar el client secret en:
/FutbolVagos/FutbolVagos/settings.py      línea 51
/frontend/futbol-vagos-frontend/src/environments/environment.ts      línea 7
/frontend/futbol-vagos-frontend/src/environments/environment.prod.ts      línea 7

### **3. Uso de la web**
Con lo anterior, ya estaría listo todo para usarse con el usuario que se creó
En el navegador abrir:
```bash
http://localhost:8000/
```


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

Se dirige a la ruta con el puerto que se configuro para KeyCloak 
```bash
http://localhost:8080/
```
y se accede con el usuario "admin" y contraseña "admin"

![image](https://github.com/user-attachments/assets/1556cb4e-93c8-4758-9839-e8a614d2bbdf)


Primero se debe crear un Realm en el apartado de Manage realms

![image](https://github.com/user-attachments/assets/41992a11-6724-48bb-b250-3fa6443cedcf)

Dentro de este realm creamos:

Un cliente con la siguiente configuración:
![image](https://github.com/user-attachments/assets/7d2d99d8-29b2-4980-9ac2-618e99965be1)
![image](https://github.com/user-attachments/assets/8f468da8-2cb0-4fe6-8286-84fb54fdca8b)
![image](https://github.com/user-attachments/assets/e41c2aba-626f-41c4-a0d1-ca20502a7bf1)

Un usuario con la siguiente configuración y su contraseña en el apartado de credentials
![image](https://github.com/user-attachments/assets/0ae12221-771a-43f5-9ffc-e337429276c4)
![image](https://github.com/user-attachments/assets/2d194c8b-78f4-4f69-a2c5-500e55637b9a)

Para hacer obtener el token mediante postman debemos copiar el client secret
![image](https://github.com/user-attachments/assets/3ac9f433-834d-47cf-951c-5b2c68e26731)

Y establecer esta configuracion para obtener un token con POST en postman
![image](https://github.com/user-attachments/assets/53f52b36-42e6-4af3-a491-58dab947d39e)
![image](https://github.com/user-attachments/assets/7f8721ae-0659-432c-87c8-11e3f807e9b5)

Y con esto ya se puede comprobar el correcto uso de keycloak en la API



