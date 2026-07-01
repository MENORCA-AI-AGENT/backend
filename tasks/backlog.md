# Backend Backlog

## Mejoras futuras

- Crear migraciones Supabase con RLS para:
  - `profiles`
  - `roles`
  - `user_roles`
  - `travel_requests`
  - `quota_ledger`
  - `payments`
  - `ratings`
- Implementar modulo `quota`.
- Implementar Stripe checkout y webhook.
- Implementar modulo `weather` con Open-Meteo.
- Implementar modulo `buses` con fuente TMSA y cache.
- Implementar modulo `places` para restaurantes y supermercados abiertos.
- Implementar modulo `ai-orchestrator` con DeepSeek, Gemini y Groq.
- Implementar modulo `rag` con Milvus.
- Implementar notificaciones/avisos.
- Agregar Swagger examples mas completos.
- Agregar CI para build/test/lint.

## Bugs encontrados

- `npm audit` reporta vulnerabilidades altas en dependencias; pendiente revisar
  si hay fix seguro sin `--force`.
- La eliminacion de usuario en Supabase no invalida JWTs ya emitidos hasta su
  expiracion; el frontend debe cerrar sesion inmediatamente.

## Refactors pendientes

- Evolucionar cada modulo grande a carpetas `domain`, `application`,
  `infrastructure` y `presentation`.
- Separar clientes externos por adapters cuando se implementen IA, Stripe,
  Milvus, clima y buses.
- Tipar respuestas de `BackendAuthService` en frontend cuando se estabilice el
  contrato compartido.
- Añadir tests e2e para endpoints protegidos con mocks de Supabase.

## Ideas para nuevas funcionalidades

- Panel admin para reindexar RAG.
- Auditoria de consumo de tokens por proveedor IA.
- Health check detallado por servicio con severidad.
- Exportacion de datos de usuario antes de borrar cuenta.
- Registro de eventos de privacidad y eliminacion.
