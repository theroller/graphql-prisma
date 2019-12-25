# prisma

# environment variables

The following environment variables are required by docker-compose.yml.
* POSTGRES_DB
* POSTGRES_HOST
* POSTGRES_PASSWORD
* POSTGRES_PORT
* POSTGRES_USER

The current schema uses several local .env-xxx files to hold variables for various environments. But, only a single `.env` file can be used when running `docker-compose up`. So, the variables for your specific deployment must be copied to `.env` before running `docker-compose up`.

```bash
# copy environment variables
cp .env-dev .env

# launch the prisma server
docker-compose up -d
```
