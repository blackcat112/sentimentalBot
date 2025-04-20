# Etapa 1: Build de la aplicación React usando Node.js
FROM node:16 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo el código fuente al contenedor
COPY . .

# Ejecutamos el build del proyecto (React)
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiamos el build generado en la etapa anterior a Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponemos el puerto 80 de Nginx
EXPOSE 80

# Ejecutamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
