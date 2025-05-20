# 1) Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto de la app y compilamos
COPY . .
RUN npm run build -- --configuration production

# 2) Etapa de producción con Nginx
FROM nginx:alpine

# Copiamos configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos compilados
COPY --from=build /app/dist/coreui-free-angular-admin-template/browser /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
