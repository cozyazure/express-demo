# Express Demo on REST API

### Requirements
You will need the following tools to develop the project.

1. `nodejs`, of version `v6.9.1` 
2. `npm`, of version `3.10.8`
3. PostgreSQL, of version `9.6.1`  

### Clone the project
```bash
$ git clone git@github.com:cozyazure/express-demo.git
$ cd express-demo
```
### Install the node_modules
```bash
$ npm install
```

### Init the database
Assuming you have already had PostgreSQL installed, you just need to init the SQL script in the project. This SQL script will drop the existing database,and the recrete it with pre inserted values.

```bash
$ psql -f config/initdb.sql
```
Afterwhich, you would want to set the password at `config/db_connection.js` to your own PostgreSQL password.

```js
var devDbPassword = "password"; //change to your own password
```

### Run the server in development mode
```bash
$ npm run dev
```

Alternatively, more manual approach:

```bash
$ NODE_ENV=development nodemon bin/www
```

or using plain `node`:

```bash
$ NODE_ENV=development node bin/www
```
You can now start to use the API. Please refer to the full [documentation](https://express-restful-demo.herokuapp.com/) on the consumption of the webservices.

Press `ctrl-c` to terminate the server.


### Run the server in Production mode

To run project in **Production** environment with `forever`:

```bash
npm install -g forever
```

Run the server in Production mode.

```bash
$ NODE_ENV=production npm start
```
You might also want to change the production connection string in `config/db_connection.js` 

### Testing

Because PostgreSQL doesn't support in-memory mock, the test will affect the database itself. You can either change your connection string, or simply use the development database (default).

To start testing, simply run: 

```bash
$ npm test
```
This assumes you have run the `initdb.sql` in `config` folder. The SQL script will create the databse itself and will seed some data for you. Alternatively you can this script in another PostgreSQl image, should you use another connection string.

```bash
$ psql -f config/initdb.sql
DROP DATABASE
CREATE DATABASE
You are now connected to database "keyvaluevault" as user "postgres".
CREATE TABLE
INSERT 0 1
INSERT 0 1
INSERT 0 1
$ npm run test
```

Please note that running `initdb.sql` will **drop** the entire database, aka will wipe out all the existing values in the said database.