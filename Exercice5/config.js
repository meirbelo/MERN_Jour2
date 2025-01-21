const nconf = require('nconf');

// Définir directement l'environnement ici (par exemple, 'development')
const env = process.env.NODE_ENV || 'development';

// Charger les configurations à partir des fichiers JSON
nconf
  .env()  // Pour permettre à nconf de charger les variables d'environnement
  .file({ file: './config.json' });

// Définir la configuration à utiliser en fonction de l'environnement
nconf.defaults({ server: { host: 'localhost', port: 4242 } });  // Valeur par défaut
nconf.set('server', nconf.get(env).server);  // Utiliser la configuration spécifique à l'environnement


// Afficher la configuration utilisée
//console.log(nconf.get(env));

module.exports = nconf;
