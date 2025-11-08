FROM  node:22.21.1-alpine3.21

LABEL OWNER="NOEMI ANCARI MICROSERVICIO ENTREGA"
LABEL PROJECT="MICROSERVICIO ENTREGA"
LABEL MAINTAINER="Noe Rous" 

ARG VERSION="2.5.1"

ENV CONFIG_FILE_PATH="/app/config"
ENV API_VERSION="v1"
ENV ENVIRONMENT="production"
WORKDIR /app

COPY package.json package.json

RUN npm install @nestjs/cli && npm install 

COPY . .
COPY .env .env

EXPOSE 3000

RUN npm run build

CMD ["node", "dist/main.js"]
