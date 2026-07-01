# Menorca Travel Agent API

Backend monolitico en NestJS para el sistema de agente turistico de Menorca.
El proyecto se esta organizando con modulos por dominio y Clean Architecture
dentro de cada recurso.

## Estado actual

- Configuracion global con `@nestjs/config`.
- Validacion global de DTOs con `ValidationPipe`, `class-validator` y
  `class-transformer`.
- Swagger habilitado en `/docs`.
- Prefijo global de API en `/api`.
- Health check operativo en `/api/health`.
- Base de roles con `Role`, `@Roles(...)` y `RolesGuard`.
- Validacion de variables de entorno sin exponer secretos.
- Tests unitarios para configuracion, roles y health checks.

## Arquitectura

La arquitectura objetivo es monolitica modular:

```txt
src
  modules
    health
    auth
    users
    travel-agent
    ai-orchestrator
    rag
    places
    weather
    buses
    payments
    quota
    ratings
    notifications
  shared
    auth
    config
    dto
    guards
```

Cada recurso nuevo debe priorizar DTOs y separar responsabilidades:

```txt
domain          Entidades, value objects e interfaces de repositorio
application     Casos de uso, DTOs internos y puertos
infrastructure  Supabase, Stripe, Milvus y clientes externos
presentation    Controllers y DTOs HTTP
```

## DTOs

Todos los DTOs deben usar `class-validator` para expresar reglas de validacion
y `class-transformer` cuando haya conversion, coercion o DTOs anidados.

Reglas del proyecto:

- Los DTOs de entrada deben validar cada campo recibido desde HTTP.
- Los DTOs con numeros, fechas, booleanos o estructuras anidadas deben usar
  transformaciones explicitas como `@Transform(...)` o `@Type(...)`.
- Los controllers no deben aceptar objetos sin DTO.
- `ValidationPipe` esta configurado con `whitelist`, `forbidNonWhitelisted` y
  `transform` para rechazar campos no permitidos y transformar payloads.
- Los DTOs de respuesta tambien pueden documentar su forma con validadores
  cuando esto ayude a mantener contratos estables para Swagger y tests.

## JSDoc

Cada archivo TypeScript debe documentarse con JSDoc explicando:

- Que funcionalidad cumple la clase, funcion o metodo.
- Que decision tecnica justifica su existencia.
- Por que la responsabilidad vive en esa capa o modulo.

Esto aplica a controllers, services, guards, DTOs, validadores y tests.

## Variables de entorno

Copia `.env.example` a `.env` y rellena solo las claves necesarias para el
entorno local. No escribas claves reales en el repositorio ni en el README.

```bash
cp .env.example .env
```

Variables principales:

```env
PORT=3000
APP_URL=http://localhost:3000

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=
JWT_EXPIRES_IN=15m

DEEPSEEK_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENAI_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_TRAVEL_PACK=

MILVUS_ADDRESS=
ETCD_ENDPOINTS=
MINIO_ADDRESS=

TMSA_BASE_URL=https://www.tmsa.es
OPEN_METEO_BASE_URL=https://api.open-meteo.com
```

## Swagger

Levanta el backend y abre Swagger:

```bash
npm run start:dev
```

URL:

```txt
http://localhost:3000/docs
```

Los endpoints reales quedan bajo el prefijo `/api`.

## Health checks

Endpoint:

```txt
GET /api/health
```

El health check verifica:

- Si las variables requeridas por servicio estan configuradas.
- Conectividad HTTP segura para proveedores publicos como Open-Meteo y TMSA.
- Estado configurado de proveedores con coste o cuota como IA, Stripe y OpenAI,
  sin ejecutar llamadas que consuman tokens o dinero.

La respuesta no expone secretos.

## Roles

Roles iniciales:

```txt
guest
user
paid_user
admin
```

Las rutas protegidas deben usar `@Roles(...)` junto al guard correspondiente.
La validacion final de JWT/Supabase se implementara en el modulo `auth`.

## Comandos

Instalar dependencias:

```bash
npm install
```

Compilar:

```bash
npm run build
```

Tests unitarios:

```bash
npm run test
```

Tests e2e:

```bash
npm run test:e2e
```

## Verificacion realizada

```txt
npm run build
npm run test -- --runInBand
npm run test:e2e -- --runInBand
```

Resultado actual: build correcto, 9 tests unitarios pasando y 1 test e2e
pasando.

## Pendientes inmediatos

- Implementar `auth` con Supabase JWT y roles reales.
- Crear migraciones Supabase con RLS.
- Implementar cuotas guest/user/paid.
- Implementar Stripe checkout y webhook.
- Implementar servicios de clima, buses y lugares abiertos.
- Implementar orquestador IA y RAG con Milvus.
- Revisar vulnerabilidades reportadas por `npm audit` antes de produccion.
