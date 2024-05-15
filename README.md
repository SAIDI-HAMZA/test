# Hospeech API

## Contents

- [Introduction](#-introduction)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Pushing your code](#-pushing-your-code)
- [Documentation](#-documentation)

## Introduction

This project is a Node.js API developed using Fastify. The purpose of this API is to integrate conversations from the app into an admin panel designed within the portal app. Additionally, in the future, the mobile app itself will utilize this API.

The backend functionality includes the management of conversations, supported languages, hospitals (along with their respective departments), and users.

One notable aspect of this API is the absence of authentication management. Instead, it solely receives a token from the portal, which originates from Azure AD. The received token is subsequently decoded and verified.

## Requirements

Please ensure that you have Node.js and yarn installed. The minimum required version of Node.js is 14.0.0.
Additionally, make sure you have a PostgreSQL server running in the background.
When cloning the project, remember to copy the contents of the `.env.dev` file into a new `.env` file.

## Installation

### Install dependencies

To install the necessary dependencies, please run the following command:

```shell
yarn install
```

### Configure the database

Ensure that you have the correct credentials and that the provided database exists by updating the database connection string in the `.env` file.
Once your database is up and running, execute the following command:

```shell
yarn prisma db push
```

This command will read the database schema located at `./prisma/schema.prisma` and create the required tables and other entities in the existing database.

Then run :

```shell
yarn prisma generate
```

This command will generate the prisma client according to the prisma schema.

### Starting the API

To start the API, run :

```shell
yarn dev
```

## Pushing your code

When incorporating modifications into the Git repository, it is necessary to perform a commit followed by a push to the GitHub platform. During the committing process, Husky will execute a set of quality assessments prior to finalizing the commit. In the event that these assessments do not meet the specified criteria, the commit action will be terminated.

## Documentation

The API's documentation is located at 0.0.0.0/docs.
Here are a few links to the libraries we use:

- [fastify](https://fastify.dev)
- [yarn](https://yarnpkg.org)
- [prisma](https://www.prisma.io)
- [swagger](https://swagger.io)
- [typebox](https://github.com/sinclairzx81/typebox)
- [husky](https://typicode.github.io/husky)
