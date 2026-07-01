# Reglas Backend

## Reglas obligatorias

- Analizar el proyecto antes de hacer cambios.
- Mantener arquitectura monolitica modular.
- Priorizar DTOs para todo payload HTTP.
- Usar `class-validator` y `class-transformer` en DTOs.
- Mantener Swagger actualizado.
- Documentar TypeScript con JSDoc explicando funcionalidad y decision tecnica.
- Actualizar README, `/docs` y `/tasks` al cerrar tareas importantes.
- No exponer claves reales ni secretos en codigo o documentacion.
- Si el usuario pega API keys en el chat, tratarlas como comprometidas y pedir
  rotacion; documentar solo nombres de variables.
- Usar `.env` para secretos de backend.
- Supabase Auth maneja autenticacion; NestJS no emite tokens de usuario.
- No usar `user_metadata` para autorizacion.
- Usar `app_metadata` o tablas backend/RLS para roles.
- Proteger rutas con guards/decorators cuando aplique.
- Agregar tests unitarios por recurso nuevo.
- Ejecutar build/tests antes de cerrar cambios funcionales.

## Seguridad

- `SUPABASE_SERVICE_ROLE_KEY` solo puede vivir en backend.
- Las tablas expuestas en Supabase deben tener RLS.
- Las tablas que dependan de usuarios deben usar cascadas cuando aplique.
- La eliminacion de cuenta debe ir por backend y cerrar sesion en frontend.
- Claves de IA, Stripe secret y Supabase service role nunca van al frontend.
- La base vectorial/RAG debe encapsularse en modulo propio.
- Stripe webhooks deben validar firma antes de modificar cuotas.

## Git

- Antes de commit/push preguntar destino si no fue indicado.
- Para features usar ramas `features/<nombre>`.
- No revertir cambios del usuario.
