@app
tt3

@http
any /*
any /api/v1/auth/*
get /api/v1/ical/*
any /graphql
any /api/discord

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

shift_positions
  pk *String
  sk **String
  encrypt true

@tables-indexes

next-auth
  pk *String
  sk **String
  name GSI1

entity
  parentPk *String
  name byParentPk

permission
  resourceType *String
  sk **String
  name byResourceTypeAndEntityId

invitation
  secret *String
  name bySecret

leave_request
  pk *String
  startDate **String
  name byPkAndStartDate

leave_request
  companyPk *String
  name byCompanyPk

leave
  leaveRequestPk *String
  leaveRequestSk **String
  name byLeaveRequestPkAndSk

@queues
events

@plugins
architect/plugin-typescript
custom-domain

@aws
runtime typescript
region eu-west-2

@typescript
build dist
base-runtime nodejs20.x
esbuild-config ../../esbuild-config.cjs