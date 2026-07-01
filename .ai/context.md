# Contexto Backend

## Estado actual

- Base NestJS implementada.
- Swagger configurado.
- Health checks configurados.
- Auth con Supabase implementado.
- Eliminacion de cuenta implementada.
- Documentacion tecnica en `/docs`.
- Tareas vivas en `/tasks`.
- Contexto operativo en `/.ai`.

## Pendiente inmediato

- Confirmar y probar variables `.env` reales.
- Crear migraciones Supabase con RLS.
- Implementar perfiles y roles persistidos.
- Implementar cuotas.
- Implementar Stripe.
- Implementar servicios externos de clima, buses y lugares abiertos.
- Implementar orquestador IA y RAG.
- Implementar integracion Stripe.
- Implementar integraciones clima/TMSA/OpenStreetMap u otra fuente libre.

## Bloqueadores conocidos

- Faltan migraciones Supabase.
- Faltan credenciales locales reales para probar integraciones externas.
- `npm audit` reporta vulnerabilidades altas pendientes de evaluar.
- Las API keys compartidas en chat deben rotarse antes de usarse en produccion.

## Archivos clave

- `src/main.ts`
- `src/app.module.ts`
- `src/modules/auth/**`
- `src/modules/health/**`
- `src/shared/config/environment.dto.ts`
- `src/shared/auth/**`
- `docs/**`
- `tasks/**`
- `.ai/**`
