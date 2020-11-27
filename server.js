require('dotenv').config();
const app = require('./app');
const debug = require('debug')('{name}:server');
const http = require('http');
const chalk = require('chalk');

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) { return val; }
  if (port >= 0) { return port; }

  return false;
}

const port = normalizePort(process.env.PORT || process.env.APPLICATION_PORT || '3310');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

// ECHO SERVER 1
// const server = http.createServer(app, (request, response) => {
//   response.write(JSON.stringify(request.headers));
//   request.pipe(response);
//   response.end();
//   console.log(request, response);
// }).listen(port);

// ECHO SERVER 2 - not working
// server.on('request', (request, response) => {
//   let body = [];
//   request.on('data', (chunk) => {
//     body.push(chunk);
//   }).on('end', () => {
//     body = Buffer.concat(body).toString();

//     console.log(`==== ${request.method} || ${request.url}`);
//     console.log('> Headers');
//     console.log(request.headers);

//     console.log('> Body');
//     console.log(body);
//     response.end();
//   });
// }).listen(port);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);

  console.log(chalk.cyan(`Your application is listening on ${bind}.`));
}

server.on('error', onError);
server.on('listening', onListening);
