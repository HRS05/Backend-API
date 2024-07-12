const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const routes = require('./routes');
const cors = require('cors');
const { corsConfig } = require('./constant/index')
const socketCommon = require('./connection/websocket/index')
require("dotenv").config();
const mode = process.env.MODE;
const server = http.createServer(app);


const { RedisManager } = require("./connection/redis/index")
const { DBManager } = require("./connection/db/index")

let portNumber = process.env.APP_PORT || 3000;

server.listen(portNumber, async function () {
  console.log("Server is running on " + portNumber);
  await DBManager.connect();
  await RedisManager.connect();
  await socketCommon.common.makeSocketConnection(server);
  app.use(
    cors({
        origin: corsConfig.ALLOWED_ORIGIN,
        methods: corsConfig.ALLOWED_REQUEST_TYPES,
        allowedHeaders: corsConfig.ALLOWED_HEADERS,
    }),
);
  app.use(bodyParser.json());
  app.use('/api/v1', routes);
});