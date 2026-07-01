# Comandos Backend

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run start:dev
```

API local:

```txt
http://localhost:3000/api
```

Swagger:

```txt
http://localhost:3000/docs
```

## Build

```bash
npm run build
```

## Tests

```bash
npm run test -- --runInBand
npm run test:e2e -- --runInBand
npm run test:cov
```

## Formato y lint

```bash
npm run format
npm run lint
```

## Produccion

```bash
npm run build
npm run start:prod
```

## Git sugerido

```bash
git checkout -b features/<nombre-tarea>
git add .
git commit -m "feat: <descripcion>"
git push -u origin features/<nombre-tarea>
```
