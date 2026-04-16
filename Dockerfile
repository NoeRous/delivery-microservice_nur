FROM node:22-alpine

LABEL OWNER="NOEMI ANCARI MICROSERVICIO ENTREGA"

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Evitar husky
ENV HUSKY=0

# 🔥 instalar TODO (necesario para build)
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# 🔥 limpiar devDependencies después del build
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]
