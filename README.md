# Express Demo on REST API

### Requirements
required node version is `v6.9.1` and npm version is `3.10.8`

### Clone the project
```bash
$ git clone git@github.com:cozyazure/express-demo.git
$ cd express-demo
```
### Install the node_modules
```bash
$ npm install
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
