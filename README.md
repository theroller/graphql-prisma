# graphql-prisma

Following along with [The Modern GraphQL Bootcamp (with Node.js and Apollo)](https://www.udemy.com/course/graphql-bootcamp).

# Deviations

* not using babel

# Synchronize GraphQL Schema

```bash
# updates src/generated/prisma.graphql
npm run get-schema
```

# Environment Variables

The requirement for a .env file is controlled by DOTENV_CONFIG_PATH. When this variable is set, then the dotenv file is loaded. Otherwise, it is expected that the environment variables have already been set.

|Variable|Description|Example|
|-|-|-|
|JWT_SECRET||secret|
|POSTGRES_DB||abcdefg|
|POSTGRES_HOST||abc.compute-1.amazonaws.com|
|POSTGRES_PASSWORD||secret|
|POSTGRES_PORT||5432|
|POSTGRES_USER||someone|
|PRISMA_ENDPOINT||http://localhost:4466|
|PRISMA_MANAGEMENT_API_SECRET||secret|
|PRISMA_SERVICE_SECRET||secret|

The `POSTGRES_` variables are used to configure the docker container for prisma.

## config/dev.env
Set this file to run `npm run start:dev`.

## config/prode.env
Set this file to run `npm start`.

## Heroku Setup
```bash
heroku login
heroku create
heroku config:set NODE_ENV=production
heroku config:set PRISMA_ENDPOINT=https://...
heroku config:set PRISMA_SERVICE_SECRET=super-secret

# production
git push heroku master
# development (on branch dev here)
git push heroku dev:master
```
