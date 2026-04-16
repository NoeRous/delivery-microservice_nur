FROM node:22-alpine

LABEL OWNER="NOEMI ANCARI MICROSERVICIO ENTREGA"

WORKDIR /app

# Copiar solo package files primero (mejor cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto del código
COPY . .

# Build
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Ejecutar app
CMD ["node", "dist/main.js"]
