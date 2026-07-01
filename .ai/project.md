# Proyecto Backend

## Resumen

Backend NestJS para Menorca AI Agent, un sistema de agente turistico para
Menorca. La API esta pensada como monolito modular con Clean Architecture por
recurso.

El producto completo sera un agente turistico para Menorca capaz de recomendar
calas, playas, lugares exoticos, restaurantes, supermercados, clima, buses y
planes personalizados. El backend concentra integraciones sensibles: Supabase,
Stripe, proveedores IA, Milvus/RAG y APIs externas.

## Objetivo del backend

- Exponer endpoints REST bajo `/api`.
- Validar usuarios autenticados con Supabase Auth.
- Proteger rutas por roles.
- Gestionar eliminacion de cuenta.
- Servir health checks de integraciones.
- Documentar endpoints con Swagger.
- Prepararse para cuotas, Stripe, clima, buses, restaurantes, IA y RAG.
- Orquestar IA con DeepSeek, Gemini y Groq.
- Usar RAG con base vectorial Milvus.
- Gestionar pagos y paquetes de peticiones con Stripe.
- Servir datos de clima, buses, restaurantes y supermercados abiertos.

## Estado funcional actual

- `GET /api`: smoke endpoint.
- `GET /api/health`: estado de configuracion/conectividad.
- `GET /api/auth/providers`: proveedores OAuth permitidos.
- `GET /api/auth/me`: usuario autenticado via Supabase access token.
- `DELETE /api/auth/me`: eliminacion de cuenta Supabase Auth.
- Swagger en `/docs`.
- DTOs con `class-validator` y `class-transformer`.
- Tests unitarios y e2e iniciales.

## Alcance funcional objetivo

- Invitado: maximo 2 peticiones.
- Usuario autenticado: hasta 5 peticiones gratuitas en total.
- Usuario pagado: 5 EUR por 20 peticiones adicionales.
- Login solo con Google y Apple mediante Supabase Auth.
- Eliminacion de cuenta por proteccion de datos.
- Roles: `guest`, `user`, `paid_user`, `admin`.
- Agente turistico estricto: no debe salirse del rol Menorca/turismo.
- RAG con documentos/lugares/transporte/restaurantes.
- Voz natural y transcripcion usando servicios de IA.

## Repositorio

```txt
https://github.com/MENORCA-AI-AGENT/backend.git
```

Rama actual de trabajo:

```txt
features/supabase-auth-roles-account-deletion
```
