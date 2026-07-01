# Stack Backend

## Runtime local detectado

```txt
Node: 24.16.0
npm: 11.13.0
Docker: 29.4.0
Java: OpenJDK 21.0.10
Xcode: 26.6
```

Flutter no se usa en este backend.

## Producto completo

```txt
Backend: NestJS monolitico modular
Frontend: Ionic + Angular + Capacitor
Auth: Supabase Auth
Base de datos principal: Supabase Postgres con RLS
Base vectorial/RAG: Milvus
Pagos: Stripe
IA texto/orquestador: DeepSeek, Gemini, Groq
Voz/STT/TTS previsto: OpenAI/speech services
Clima: Open-Meteo
Buses: TMSA Menorca
Restaurantes/supermercados: fuente libre tipo OpenStreetMap/Overpass
```

## Backend

```txt
NestJS CLI: 11.0.23
@nestjs/core: ^11.0.1
@nestjs/common: ^11.0.1
@nestjs/config: ^4.0.4
@nestjs/swagger: ^11.4.5
TypeScript: ^5.7.3
```

## Auth y proveedores externos

```txt
@supabase/supabase-js: ^2.110.0
Supabase project URL: https://ocwakwtzliledabccvgc.supabase.co
OAuth permitidos: google, apple
```

## Supabase

```txt
Supabase Auth: activo como autoridad de autenticacion
Supabase Database: previsto para perfiles, roles, cuotas, pagos y ratings
RLS: obligatorio en tablas expuestas
Service role: solo backend
Publishable key: permitida en frontend
```

Variables:

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_AUTH_PROVIDERS=google,apple
```

## Base de datos y RAG

```txt
Relacional: Supabase Postgres
Vectorial: Milvus
ETCD_ENDPOINTS=$(PROJECT_NAME)_milvus-etcd:2379
MINIO_ADDRESS=$(PROJECT_NAME)_milvus-minio:9000
```

Variables:

```env
MILVUS_ADDRESS=
ETCD_ENDPOINTS=
MINIO_ADDRESS=
```

Colecciones previstas:

```txt
menorca_places_knowledge
menorca_transport_knowledge
menorca_restaurants_knowledge
menorca_agent_memory
```

## IA y API keys

No guardar valores reales de API keys en codigo, README, docs, tasks ni `.ai`.
Las claves compartidas previamente en chat deben rotarse.

Variables previstas:

```env
DEEPSEEK_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENAI_API_KEY=
```

Orquestacion prevista:

```txt
1. DeepSeek
2. Gemini fallback
3. Groq fallback
RAG antes del prompt final
Fallback por error, respuesta insuficiente o limite de tokens
```

## Pagos

```txt
Stripe Checkout
Pack objetivo: 5 EUR por 20 peticiones adicionales
Webhook requerido para acreditar cuotas
```

Variables:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_TRAVEL_PACK=
```

## APIs externas de turismo

```env
OPEN_METEO_BASE_URL=https://api.open-meteo.com
TMSA_BASE_URL=https://www.tmsa.es
```

Fuentes previstas:

- Open-Meteo para clima por dia/franjas mañana, tarde y noche.
- TMSA para horarios de buses.
- OpenStreetMap/Overpass o fuente libre equivalente para restaurantes y
  supermercados abiertos.

## Validacion y documentacion

```txt
class-validator: ^0.15.1
class-transformer: ^0.5.1
swagger-ui-express: ^5.0.1
```

## HTTP y tests

```txt
@nestjs/axios: ^4.0.1
axios: ^1.18.1
Jest: ^30.0.0
Supertest: ^7.0.0
ts-jest: ^29.2.5
```

## Roadmap tecnologico

- Supabase Database/RLS.
- Stripe.
- Milvus/RAG.
- DeepSeek.
- Gemini.
- Groq.
- OpenAI.
- Open-Meteo.
- TMSA.
- OpenStreetMap/Overpass.
- Notificaciones/avisos.
