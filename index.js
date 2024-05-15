const express = require("express");
const app = express();
var http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const routes = require('./routes');
const cors = require('cors');
const { corsConfig } = require('./constant/index')

require("dotenv").config();

const { RedisManager } = require("./connection/redis/index")
const { DBManager } = require("./connection/db/index")


const { APP_PORT } = process.env;

console.log("API_port ---> " + process.env.APP_PORT);

let portNumber = process.env.APP_PORT || 3000;
server.listen(portNumber, async function () {
  console.log("Server is running on " + portNumber);
  await DBManager.connect();
  await RedisManager.connect();
  app.use(
    cors({
        origin: corsConfig.ALLOWED_ORIGIN,
        methods: corsConfig.ALLOWED_REQUEST_TYPES,
        allowedHeaders: corsConfig.ALLOWED_HEADERS,
    }),
);
  app.use(bodyParser.json());
  app.use('/api/v1', routes);
  // app.use(useClickhouse);
  // app.use("/api/user/", userAPI);
  // app.use("/api/log/", logAPI);
});