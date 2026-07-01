# API Backend

## Base URL

Local:

```txt
http://localhost:3000/api
```

Swagger:

```txt
http://localhost:3000/docs
```

## Autenticacion

Los endpoints protegidos reciben un access token de Supabase:

```http
Authorization: Bearer <supabase_access_token>
```

NestJS valida el token con `supabase.auth.getUser(token)`. No se emiten JWTs
propios desde el backend.

## Endpoints

### GET `/api`

Smoke test de la API.

Servicio:

- `AppService.getHello()`

Respuesta:

```txt
Menorca Travel Agent API
```

### GET `/api/health`

Devuelve estado de configuracion y conectividad de integraciones.

Controller:

- `HealthController.check()`

Servicio:

- `HealthService.check()`

Dependencias:

- `ConfigService`
- `HttpService`
- Open-Meteo y TMSA para probes HTTP cuando estan configurados.

Respuesta ejemplo:

```json
{
  "status": "degraded",
  "checkedAt": "2026-07-01T12:00:00.000Z",
  "services": [
    {
      "name": "supabase",
      "configured": true,
      "reachable": true,
      "message": "Configured; live probe skipped to avoid consuming provider quota."
    },
    {
      "name": "open-meteo",
      "configured": true,
      "reachable": true,
      "latencyMs": 120
    }
  ]
}
```

### GET `/api/auth/providers`

Devuelve los proveedores OAuth permitidos.

Controller:

- `AuthController.getAllowedProviders()`

Servicio:

- `SupabaseAuthService.getAllowedProviders()`

Respuesta:

```json
[
  { "provider": "google" },
  { "provider": "apple" }
]
```

### GET `/api/auth/me`

Devuelve el usuario autenticado normalizado por backend.

Guards:

- `SupabaseAuthGuard`

Controller:

- `AuthController.getCurrentUser()`

Servicio:

- `SupabaseAuthService.authenticateBearerToken()`

Request:

```http
GET /api/auth/me
Authorization: Bearer <supabase_access_token>
```

Respuesta:

```json
{
  "id": "9e6f3f6d-8c2c-4f64-a69c-03d3bfb2d533",
  "email": "user@example.com",
  "roles": ["user"],
  "provider": "google"
}
```

Errores:

```json
{
  "statusCode": 401,
  "message": "Invalid Supabase access token.",
  "error": "Unauthorized"
}
```

### DELETE `/api/auth/me`

Elimina la cuenta del usuario autenticado en Supabase Auth.

Guards:

- `SupabaseAuthGuard`

Controller:

- `AuthController.deleteCurrentUser()`

Servicio:

- `SupabaseAuthService.deleteAccount()`

Dependencias:

- `SUPABASE_SERVICE_ROLE_KEY` en backend.

Request:

```http
DELETE /api/auth/me
Authorization: Bearer <supabase_access_token>
```

Respuesta:

```json
{
  "deleted": true,
  "message": "Account deletion requested. The current access token may remain valid until it expires."
}
```

Nota: el frontend debe cerrar sesion inmediatamente despues de llamar este
endpoint porque los JWT existentes pueden seguir siendo validos hasta expirar.

## DTOs

### `AuthProviderDto`

```ts
{
  provider: 'google' | 'apple'
}
```

Validaciones:

- `@IsIn(['google', 'apple'])`

### `CurrentUserResponseDto`

```ts
{
  id: string;
  email?: string;
  roles: Role[];
  provider?: string;
}
```

Validaciones:

- `id`: `@IsString()`
- `email`: `@IsOptional()`, `@IsEmail()`
- `roles`: `@IsArray()`, `@IsEnum(Role, { each: true })`, `@Type(() => String)`
- `provider`: `@IsOptional()`, `@IsString()`

### `DeleteAccountResponseDto`

```ts
{
  deleted: boolean;
  message: string;
}
```

Validaciones:

- `deleted`: `@IsBoolean()`
- `message`: `@IsString()`

### `HealthResponseDto`

```ts
{
  status: 'ok' | 'degraded';
  checkedAt: string;
  services: ServiceHealthDto[];
}
```

Validaciones:

- `status`: `@IsIn(['ok', 'degraded'])`
- `checkedAt`: `@IsISO8601()`
- `services`: `@IsArray()`, `@ValidateNested({ each: true })`,
  `@Type(() => ServiceHealthDto)`

### `ServiceHealthDto`

```ts
{
  name: string;
  configured: boolean;
  reachable: boolean;
  latencyMs?: number;
  message?: string;
}
```

Validaciones:

- `name`: `@IsString()`
- `configured`: `@IsBoolean()`
- `reachable`: `@IsBoolean()`
- `latencyMs`: `@IsOptional()`, `@IsInt()`, `@Min(0)`
- `message`: `@IsOptional()`, `@IsString()`

### `EnvironmentDto`

Valida variables como `PORT`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_AUTH_PROVIDERS`, claves de IA, Stripe,
Milvus, TMSA y Open-Meteo.

## Servicios

### `AppService`

- `getHello()`: devuelve el mensaje del smoke endpoint.

### `HealthService`

- `check()`: agrega resultados de todos los probes.
- `checkService()`: metodo privado que verifica configuracion y, cuando aplica,
  conectividad HTTP.

Servicios revisados por health:

- Supabase.
- Open-Meteo.
- TMSA.
- DeepSeek.
- Gemini.
- Groq.
- OpenAI.
- Stripe.
- Milvus.

### `SupabaseAuthService`

- `getAllowedProviders()`: devuelve `google` y `apple`.
- `authenticateBearerToken(token)`: valida access token con Supabase.
- `deleteAccount(userId)`: borra usuario via Supabase Admin API.
- `mapSupabaseUser()`: privado, normaliza usuario.
- `extractRoles()`: privado, lee roles de `app_metadata`.
- `parseAllowedProviders()`: privado, filtra proveedores permitidos.

## Dependencias principales

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config`
- `@nestjs/swagger`, `swagger-ui-express`
- `@supabase/supabase-js`
- `@nestjs/axios`, `axios`
- `class-validator`, `class-transformer`
- `jest`, `supertest`, `ts-jest`

## Ejemplos curl

```bash
curl http://localhost:3000/api
```

```bash
curl http://localhost:3000/api/health
```

```bash
curl http://localhost:3000/api/auth/providers
```

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
```

```bash
curl -X DELETE http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
```
