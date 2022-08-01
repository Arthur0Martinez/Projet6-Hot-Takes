//Application qui prend les paramètres et fait fonctionner le serveur

//Récupère le nécessaire pour faire tourner le serveur, nottament sur app.js
const http = require('http');
const app = require('./app');

//Sécurité permettant de s'assurer que le port est bien un nombre ou une chaine.
//Enregistre ses erreurs sur le serveur
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//Définit le serveur sur le port 3000 et lance l'API
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Récupère et traite les erreurs liés au serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//Créé et lance le serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
