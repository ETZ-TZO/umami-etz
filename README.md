# umami

Umami is a simple, fast, privacy-focused alternative to Google Analytics.  
This repository is a fork of Umami, used for analytics on their dashboard.

## Getting started

A detailed getting started guide can be found at [https://umami.is/docs/](https://umami.is/docs/)

## Installing from source

### Requirements

- A server with Node.js version 12 or newer
- A database. Umami supports [MySQL](https://www.mysql.com/) and [Postgresql](https://www.postgresql.org/) databases.

### Install Yarn

```
npm install -g yarn
```

### Get the source code and install packages

```
git clone https://github.com/ETZ-TZO/umami-etz.git
cd umami
yarn install
```

### Configure umami

Create an `.env` file with the following

```
DATABASE_URL={DB_TYPE}://{USER}:{PASS}@{IP}/{DB_NAME}
DATABASE_TYPE={DB_TYPE}
POSTGRES_DB={DB_NAME}
POSTGRES_USER={USER}
POSTGRES_PASSWORD={PASS}
HASH_SALT={RANDOM_STRING}

```

The connection url is in the following format:
```
postgresql://username:mypassword@localhost:5432/mydb

mysql://username:mypassword@localhost:3306/mydb
```

### Build the application

```bash
yarn build
```

### Create database tables

```bash
yarn update-db
```

This will also create a login account with username **admin** and password **umami**.

### Start the application

```bash
yarn start
```

By default this will launch the application on `http://localhost:3000`. You will need to either
[proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) requests from your web server
or change the [port](https://nextjs.org/docs/api-reference/cli#production) to serve the application directly.

## Installing with Docker

To build the umami container and start up a Postgres database, run:

```bash
docker-compose up
```

## Getting updates

To get the latest features, simply do a pull, install any new dependencies, and rebuild:

```bash
git pull
yarn install
yarn build
yarn update-db
```

## License

MIT
