# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY futbol-vagos-frontend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY futbol-vagos-frontend/ .

# Construir la aplicación
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=build /app/dist/futbol-vagos-frontend /usr/share/nginx/html/

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 