require("dotenv").config();
const mongoose = require("mongoose");
// Charge le module HTTP de Node.js
const http = require("http");
const app = require("./app");

// set port, listen for requests : middlewares installés par défaut par Express.
// la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée.
// Elle est ensuite enregistrée dans le serveur ;
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// app.set("port", process.env.PORT || 6000);

// Crée un serveur HTTP
const server = http.createServer(app);

// Ecouteur de requête enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
//15-connect to DB : it is asynchronous so we're gonna have a promise, so we need to catch it
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     // 3-listen for request
//     app.listen(process.env.PORT, () => {
//       console.log("coonected to DB & listening on port", process.env.PORT);
//     });
//   })
//   .catch(() => {
//     console.log(error);
//   });
