FROM node:22-alpine

LABEL OWNER="NOEMI ANCARI MICROSERVICIO ENTREGA"

WORKDIR /app

# Copiar package files
COPY package*.json ./

# 🔥 IMPORTANTE: evitar husky en build
ENV HUSKY=0

# Instalar dependencias sin dev
RUN npm ci --omit=dev

# Copiar código
COPY . .

# Build
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Ejecutar app
CMD ["node", "dist/main.js"]
