const express = require('express');
const nconf = require('./config');
const {connectDB } = require("./database")
const studentRouter = require("./routes/studentRoutes");
const path = require('path')

const app = express();

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// Récupérer la configuration du serveur à partir de nconf
const host = nconf.get('server:host');
const port = nconf.get('server:port');

app.use(express.static("public"));

app.use("/student", studentRouter)

connectDB()
  .then(() => {
    app.listen(port, host, () => {
      console.log(
        `Server démarré sur http://${host}:${port} en mode ${nconf.get(
          "server:mode"
        )}`
      );
    });
  })
  .catch((err) => {
    console.error("Erreur lors de la connexion à la base de données:", err);
  });

