## Happy Dayz Event Hosting Application API

### Tech Stack: 
- Express/Node.js
- Postgres SQL & Prisma ORM
- Passport and JWT Authentication

### What it does: 
- Performs CRUD functions following RESTful pattern
- Signs and checks Json Web tokens for protected routes


### Initializing
- After npm install, the tests depend on two psql db, happy_dayzdb & test_hdayzdb. the schema.prisma will need to apply migrations to both db on init. By default it will migrate only to the happy_dayzdb and the connection string cannot be dynamically inserted at runtime for a schema.prisma file. You will need to manually change the connection string in the env variable for "DATABASE_URL" to the connection string for "TEST_DATABASE_URL" and `run npx prisma migrate dev`. Then of course change it back and the tests should run fine from there.  
