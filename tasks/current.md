# Current Backend Tasks

## Qué se está desarrollando actualmente

- Documentacion tecnica del backend en `/docs`.
- Registro vivo de tareas en `/tasks`.
- Contexto persistente para agentes en `/.ai`, actualizado con stack completo,
  Supabase, Milvus/RAG, Stripe, proveedores IA y politica de API keys.
- Base de autenticacion con Supabase Auth ya implementada en la rama actual.

## Qué falta por terminar

- Revisar la documentacion tecnica creada y mantenerla sincronizada con cambios
  futuros.
- Confirmar merge de la rama `features/supabase-auth-roles-account-deletion`.
- Crear migraciones Supabase para perfiles, roles y cascadas de eliminacion.
- Conectar el frontend contra `GET /api/auth/me` y `DELETE /api/auth/me` en flujo
  real.

## Próximos pasos

1. Implementar esquema Supabase inicial con RLS:
   - `profiles`
   - `roles`
   - `user_roles`
   - tablas base para cuotas
2. Agregar endpoint/backend use cases de cuotas guest/user/paid.
3. Integrar Stripe para compra de 20 peticiones por 5 EUR.
4. Implementar servicios de clima, buses y lugares abiertos.
5. Empezar orquestador IA y RAG.

## Bloqueadores

- Falta confirmar las politicas RLS y estructura definitiva de tablas Supabase.
- Falta tener valores reales de `.env` local para probar algunos servicios
  externos.
- `npm audit` reporta vulnerabilidades altas pendientes de revisar antes de
  produccion.

## Archivos afectados

- `README.md`
- `docs/architecture.md`
- `docs/api.md`
- `docs/decisions.md`
- `docs/conventions.md`
- `tasks/current.md`
- `tasks/backlog.md`
- `.ai/project.md`
- `.ai/rules.md`
- `.ai/context.md`
- `.ai/commands.md`
- `.ai/stack.md`
- `src/modules/auth/**`
- `src/modules/health/**`
- `src/shared/**`
