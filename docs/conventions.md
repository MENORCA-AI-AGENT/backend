# Convenciones Backend

## Convenciones de codigo

- TypeScript estricto sobre la base del starter NestJS.
- NestJS con modulos, controllers, services, guards y decorators.
- DTOs con `class-validator`, `class-transformer` y Swagger decorators.
- JSDoc en clases, funciones, metodos, guards, DTOs y tests.
- Variables de entorno centralizadas en `EnvironmentDto`.
- Secretos solo en `.env` o entorno de despliegue, nunca en codigo.
- `npm run format` usa Prettier sobre `src/**/*.ts` y `test/**/*.ts`.

## Nombres

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Modules: `*.module.ts`
- Guards: `*.guard.ts`
- Decorators: `*.decorator.ts`
- DTOs: `*.dto.ts`
- Entidades de dominio: `*.entity.ts`
- Tests: `*.spec.ts`

## Organizacion

```txt
src/modules/<feature>
  domain
  dto
  *.controller.ts
  *.module.ts
  *.service.ts
```

Para modulos mas grandes se debe evolucionar a:

```txt
domain
application
infrastructure
presentation
```

`shared` contiene piezas transversales, no logica de negocio:

- Roles.
- Decoradores.
- Guards compartidos.
- Configuracion y validacion de entorno.

## Buenas practicas actuales

- Auth delegada a Supabase.
- Service role key solo en backend.
- `user_metadata` no se usa para autorizacion.
- Health checks no exponen secretos.
- Los DTOs documentan y validan contratos.
- Swagger esta disponible para pruebas manuales.
- Tests unitarios cubren config, roles, auth y health.
- E2E smoke test valida `/api`.

## Buenas practicas para nuevos recursos

- Crear DTOs antes de aceptar payloads HTTP.
- Mantener controllers delgados y delegar a services/use cases.
- Probar guards, services y controllers.
- Actualizar README y docs al cerrar cada tarea.
- No mezclar integraciones externas directamente en controllers.
- Usar RLS en tablas expuestas de Supabase.
- Usar `on delete cascade` cuando una tabla propia dependa de `auth.users`.
- Mantener las claves de IA, Stripe y service role fuera del frontend.

## Tecnologias y estado actual

Tecnologias activas:

- NestJS.
- Supabase Auth.
- Swagger.
- class-validator.
- class-transformer.
- Jest/Supertest.

Tecnologias preparadas o planificadas:

- Supabase Database/RLS.
- Stripe.
- Milvus.
- DeepSeek, Gemini, Groq y OpenAI.
- Open-Meteo.
- TMSA.
