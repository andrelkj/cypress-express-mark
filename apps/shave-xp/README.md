# Onboarding

## Email service

We're using Ethereal to generete our credentials and allow all emails to be sent and managed through it without the need to use a real or personal email. It's important to note that from time to time the account is lost so a new one needs to be created in order to keep using the application.

My generated credentials were:

```
Name	Susan Hahn
Username	susan7@ethereal.email (also works as a real inbound email address)
Password	KNUQdSab8nfZjXtCgb
```

## PostgreSQL

We'll use ElephantSQL in order to manage our PostgreSQL database.

In order to use it we need to:
1. Configure and create our database through ElephantSQL
2. Initialize (`npm run db:init`) and populate (`npm run db:populate`) it with all necessary information
3. Make the application online (`npm run dev`)

**OBS.:** both front-end (web) and back-end (api) should be online for us to run the application locally.

## Cypress

We'll use cypress to automate the application with is a javascript software build in node.js.

In order to use it we need to:
1. Create a [file](../projects/shave-xp-cypress) we're all Cypress related stuff will be stored
2. Inside the file we'll initialize node.js (`npm init`)
3. And follow through entering all required information
**OBS.:** for now we'll just use the standard values, just typping enter to continue.
4. By confirming the initialization a package.json file should be created
5. Install cypress - in here we'll install cypress as a development dependency (`npm install cypress --save-dev`) so it'll only be executed in a dev environment once it won't be necessary in the production environment.
6. Open Cypress GUI (`npx cypress open`)


## Terminal commands

- `npm run db:init` - initialize the dabase
- `npm run db:populate` - populate the database with all necessary data for it to run
- `npm run dev` - make the application online
- `npm init` - initialize node.js
- `npm install cypress --save-dev` - install cypress as a development dependency
- `npx cypress open` - open cypress GUI

## Important links

[Ethereal](https://ethereal.email/) - Creates fictitious email credentials
[ElephantSQL](https://customer.elephantsql.com/) - SQL databage online manager
[Cypress](https://www.cypress.io/) - Automation testing tool