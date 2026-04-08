# Microservicio Delivery

## Descripción
Este microservicio gestiona la logística de entrega de paquetes. Permite:
- Crear Dealers (repartidores).
- Crear Paquetes.
- Crear rutas y asociar múltiples paquetes a ellas
- Marcar paquetes como En Tránsito o Entregados

El microservicio está desarrollado aplicando:
- **Domain Driven Design (DDD)**
- **Arquitectura Limpia**
- **CQRS**

No incluye frontend; expone una API REST para ser consumida por otros servicios o aplicaciones.

## Endpoints



| Método   | Ruta                              | Acción                                      |
| -------- | --------------------------------- | ------------------------------------------- |
| **POST** | `/delivery/create-dealer`         | Crear un nuevo Repartidor                   |
| **POST** | `/delivery/create-package`        | Crear un paquete                            |              |
| **POST** | `/delivery/:id/deliver`           | Marcar paquete como **Entregado**           |
| **POST** | `/delivery/:id/transit`           | Marcar paquete como **En Camino**           |
| **POST** | `/delivery/assign-packages-route` | Crear una ruta y asignar múltiples paquetes |


## Capa de Dominio

### Diagrama de clases
![Diagrama de clases](docs/diagrama.png)




### Entidades
- Dealer
- Package
- DeliveryRoute

### Value Objects
- CellPhone
- Address

### Agregados
- DeliveryRoute (agrega paquetes y dealer)

## Tecnologías
- Node.js / NestJS
- PostgreSQL
- TypeORM
- CQRS (@nestjs/cqrs)



# LEVANTAR PROYECTO CON DOCKER ---modificado

## PASO 1 

crear el archivo .env envase a env.example

## PASO 2

ejecutar el comando 

docker-compose up -d



# LEVANTAR PROYECTO SIN DOCKER Y EJECUACIÓN TEST 

## PASO 1 

crear el archivo .env envase a env.example

## PASO 2

ejecutar el comando 

npm install 

## PASO 3 

ejecutar TEST cons JEST 

npm run test


## Contract Testing (Pact)

Se añadieron pruebas de contrato usando Pact para demostrar la interacción entre un consumidor (`delivery-consumer`) y el proveedor (`delivery-provider`).

- Los pacts generados se almacenan en la carpeta `pacts/` en la raíz del proyecto.
- Se incluyeron dos interacciones desde el consumidor:
	- Crear paquete (`POST /packages`)
	- Asignar paquete a dealer (`POST /packages/assign`)

Cómo ejecutar las pruebas de contrato:

1. Instalar dependencias:

```powershell
npm install
```

2. Ejecutar las pruebas consumidor (crea los pact files en `pacts/`):

```powershell
npm run test:contracts:consumer
```

3. Verificar los pacts contra el provider (el provider debe estar corriendo en `http://localhost:3000`):

```powershell
# En otra terminal, levantar el provider (application Nest)
npm run start:dev

# Luego ejecutar la verificación (lee el pact generado en `pacts/`)
npm run test:contracts:provider
```

Nota: la verificación del provider asume que las rutas expuestas por el servicio coinciden con las interacciones definidas (si usas rutas diferentes ajusta las pruebas en `src/contracts/`).

by noemi

