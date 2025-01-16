@app
tt3

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

entity
  pk *String
  name String
  parentPk String
  encrypt true

entity_settings
  pk *String
  sk **String
  encrypt true

permission
  pk *String
  sk **String
  resourceType String
  parentPk String
  type Number
  encrypt true

invitation
  pk *String 
  sk **String
  encrypt true

leave_request
  pk *String
  sk **String
  encrypt true

leave
  pk *String
  sk **String
  leaveRequestPk String
  encrypt true

@tables-indexes

next-auth
  pk *String
  sk **String
  name GSI1

permission
  resourceType *String
  sk **String
  name byResourceTypeAndEntityId

invitation
  secret *String
  name bySecret

leave
  leaveRequestPk *String
  leaveRequestSk *String
  name byLeaveRequestPkAndSk

@queues
events

@plugins
architect/plugin-typescript

@aws
runtime typescript
region eu-west-2

@typescript
build dist
base-runtime nodejs20.x
esbuild-config ../../esbuild-config.cjs