# umami

Umami is a simple, fast, privacy-focused alternative to Google Analytics.  
This repository is a fork of Umami, used for analytics on the TZO dashboard.

## Getting started

A detailed getting started guide on the original codebase can be found at [https://umami.is/docs/](https://umami.is/docs/)

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

Create an `.env` file with the following keys, replace the {} values with the correct information.

```
DATABASE_URL={DB type}://{user}:{password}@{ip}/{DB name}
DATABASE_TYPE={DB type}
POSTGRES_DB={DB name}
POSTGRES_USER={user}
POSTGRES_PASSWORD={password}
HASH_SALT={a random string}

SERVER_NAME={The server's hostname}
SSL_KEY={The file name of the SSL key in /certs}
SSL_CERT={The file name of the SSL cert in /certs}
```

Examples of what the connection URL might look like:
```
postgresql://username:mypassword@localhost:5432/mydb

mysql://username:mypassword@localhost:3306/mydb
```

## Local run
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

## Docker setup

To build the umami container and start up a Postgres database, run:

```bash
docker-compose up
```

## License

MIT
