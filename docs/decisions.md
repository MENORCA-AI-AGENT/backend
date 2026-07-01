# Decisiones Backend

## Decisiones importantes

### NestJS como API monolitica modular

El backend se mantiene como un monolito modular. Esto permite avanzar rapido sin
microservicios prematuros, pero conserva limites claros por modulo.

### Clean Architecture por recurso

La convencion objetivo por modulo es:

```txt
domain
application
infrastructure
presentation
```

El modulo `auth` ya usa una entidad de dominio (`AuthenticatedUser`) y DTOs. Los
modulos futuros deben completar la separacion por capas.

### Supabase Auth como autoridad de autenticacion

NestJS no maneja passwords ni emite JWTs de usuario. El frontend obtiene un
access token de Supabase y el backend lo valida con Supabase Auth.

Motivo:

- Reduce superficie de seguridad propia.
- Evita duplicar logica de Auth.
- Facilita login con Google y Apple.

### Roles desde `app_metadata`

Los roles se leen de `app_metadata.role` o `app_metadata.roles`. No se usan
datos de `user_metadata` para autorizacion porque son modificables por el
usuario.

### Eliminacion de cuenta en backend

`DELETE /api/auth/me` usa el cliente admin de Supabase con service role key.
Esta clave solo puede existir en backend.

Motivo:

- Cumplir derecho de eliminacion de cuenta.
- Evitar exponer credenciales administrativas al cliente.

### DTOs con `class-validator` y `class-transformer`

Todos los DTOs deben expresar reglas de validacion y transformacion. El
`ValidationPipe` global usa:

```ts
whitelist: true
forbidNonWhitelisted: true
transform: true
```

### Swagger desde el inicio

Swagger vive en `/docs` y permite probar endpoints desde el navegador. Los DTOs
se decoran con `@ApiProperty` o `@ApiPropertyOptional` para mantener contrato
visible.

### Health checks sin gastar cuota

Los proveedores que pueden consumir tokens/dinero se validan como
"configurados" si tienen variables. Los proveedores publicos con URL segura
pueden recibir probe HTTP.

### JSDoc obligatorio

Cada archivo TypeScript documenta funcionalidad y decision tecnica. Esto reduce
ambiguedad en un proyecto que crecera con muchos modulos.

## Patrones utilizados

- Controller-Service de NestJS.
- Guards (`SupabaseAuthGuard`, `RolesGuard`).
- Decorators (`CurrentUser`, `Roles`).
- DTOs como contratos HTTP.
- Environment validation.
- Dependency injection.
- Tests unitarios por pieza.
- E2E smoke test con Supertest.

## Convenciones

- Los endpoints reales usan prefijo `/api`.
- Los nombres de DTO terminan en `Dto`.
- Los tests unitarios viven junto a su recurso con extension `.spec.ts`.
- Los endpoints protegidos usan bearer token de Supabase.
- Las claves secretas se leen por variables de entorno.
- Los proveedores OAuth permitidos son `google` y `apple`.
- No se exponen valores secretos en health responses ni README.

## Posibles mejoras futuras

- Agregar modulo `users/profiles` con tablas Supabase y RLS.
- Crear migraciones para `profiles`, `roles`, `user_roles` y cascadas de borrado.
- Añadir `JwtAuthGuard` especifico solo si se decide validar JWT localmente con
  JWKS; por ahora se delega a Supabase `auth.getUser`.
- Integrar `RolesGuard` en rutas protegidas que requieran roles concretos.
- Implementar cuotas guest/user/paid.
- Implementar Stripe checkout/webhook.
- Implementar clima, buses, restaurantes y supermercados.
- Implementar orquestador IA y RAG con Milvus.
- Añadir OpenAPI examples mas completos por endpoint.
- Automatizar security/performance advisors de Supabase en CI.
- Revisar vulnerabilidades de `npm audit` antes de produccion.
