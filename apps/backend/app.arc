@app
backend

@http
any /api/v1/auth/*
any /graphql

@static
spa true

@tables

next-auth
  pk *String
  sk **String
  expires TTL
  encrypt true

@tables-indexes

next-auth
  pk *String
  sk **String
  name GSI1

@plugins
architect/plugin-typescript

@aws
runtime typescript
region eu-west-2

@typescript
build dist
base-runtime nodejs20.x
esbuild-config ../../esbuild-config.js