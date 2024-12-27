@app
backend

@static
spa true

@plugins
architect/plugin-typescript

@aws
runtime typescript
region eu-west-2

@typescript
build dist
base-runtime nodejs18.x