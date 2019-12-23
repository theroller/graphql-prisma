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
|PRISMA_ENDPOINT||http://localhost:4466|
|PRISMA_SERVICE_SECRET||secret|

## config/dev.env
Set this file to run `npm run start:dev`.

## config/prod.env
Set this file to run `npm start`.

## Heroku Setup
The following variables are used by docker-compose and can be put in a dotenv file (e.g. dev-primsa.env).

|Variable|Description|Example|
|-|-|-|
|POSTGRES_DB||abcdefg|
|POSTGRES_HOST||abc.compute-1.amazonaws.com|
|POSTGRES_PASSWORD||secret|
|POSTGRES_PORT||5432|
|POSTGRES_USER||someone|
|PRISMA_MANAGEMENT_API_SECRET||secret|

```bash
heroku login
heroku create

# all of the environment variables in config/prod.env must be set
heroku config:set JWT_SECRET=super-secret
heroku config:set NODE_ENV=production
heroku config:set PORT=4000
heroku config:set PRISMA_ENDPOINT=https://...
heroku config:set PRISMA_SERVICE_SECRET=super-secret

# production
git push heroku master
# development (on branch dev here)
git push heroku dev:master
```

## docker-compose
Local environment file must be named `.env`. The env_file and environment values in docker-compose.yml are for setting variables in the container.

## token
In order to generate a token, the .env file from the config directory must be used.

```bash
cd prisma

# example using development environment
prisma token -e ../config/dev.env
```
