# Usa una imagen base oficial con Node.js
FROM node:18

# Establece la carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia archivos de dependencias e instálalas
COPY package*.json ./
RUN npm install

# Copia el resto del proyecto
COPY . .

# Construye la app para producción con Vite
RUN npm run build

# Instala 'serve' para servir la app estática
RUN npm install -g serve

# Expone el puerto 80
EXPOSE 80

# Sirve la carpeta 'dist' como una SPA en el puerto 80
CMD ["serve", "-s", "dist", "-l", "80"]