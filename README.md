# The folder structure

```shell
src
│ app.js # App entry point
└───api # Express route controllers for all the endpoints of the app
└───config # Environment variables and configuration related stuff
└───jobs # Jobs definitions for agenda.js
└───loaders # Split the startup process into modules
└───models # Database models
└───services # All the business logic is here
└───subscribers # Event handlers for async task
└───types # Type declaration files (d.ts) for Typescript
```

# Features

## Group by features

The code is structure by domain

## Prisma

Setup

```
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

Use the model & argument types generated by Prisma Client

## Husky

Husky hook is setup to auto run eslint & prettier during pre-commit hooks

## Docker compose file to setup the Postgres DB & PgAdmin

```
docker-compose up -d
```

# HTTP Status

Follow: https://restfulapi.net/http-methods/
