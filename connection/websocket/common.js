const webSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { CALL_TYPE, SOCKET_CALL_TYPE } = require("./constant");
const { isUndefinedOrNull } = require("../../utils/validators");
const url = require('url');

let webSocketConnectionMap = {};

const makeResponse = (data) => {
    return JSON.stringify({data});
}

const validateUser = ({ token, ws }) => {
  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(user);
    ws.id = user.user_id; // Assign user ID to the WebSocket connection
    webSocketConnectionMap[user.user_id] = ws; // Map the user ID to the WebSocket connection
    ws.send(makeResponse("User identified successfully!"));
  } catch (err) {
    ws.close(1008, "Invalid token");
}
};

const makeCall = async ({ data, ws }) => {
  const { peerId, toCall, callType } = data;
  const userws = webSocketConnectionMap[toCall];
  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    ws.send(makeResponse("User not found!"));
    return;
  }
  console.log(userws);
  userws.send(
    JSON.stringify({
      peerId,
      callBy: ws.id,
      callType,
    })
  );
};

const callStatus = async ({ data, ws }) => {
    const { status, toCall } = data;
    const userws = webSocketConnectionMap[toCall];
    if (isUndefinedOrNull(userws)) {
      // TODO: have to make notification entry
      ws.send(makeResponse("User not found!"));
      return;
    }
    userws.send(
      JSON.stringify({
        status,
        callBy: ws.id,
      })
    );
  };


const makeSocketConnection = async (server) => {
  try {
    //creating websocket server
    const wss = new webSocket.Server({ server });
    wss.on("connection", function connection(ws, req) {
      console.log("A new client Connected!");
      const parameters = url.parse(req.url, true).query;
      const token = parameters.token;
      console.log("token -> ", token);
      validateUser({ token, ws });

      ws.on("message", async function incoming(message) {
        try {
          const data = JSON.parse(message);
          console.log(data);
          switch (data.type) {
            case SOCKET_CALL_TYPE.CALL:
                await makeCall({ data, ws });
            case SOCKET_CALL_TYPE.CALL_STATUS:
                await callStatus({ data, ws });
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      ws.on("close", () => {
        const id = ws.id;
        delete webSocketConnectionMap[id];
      });
    });
  } catch (error) {
    //Logger.error(`Error while creating redis client ${JSON.stringify(error)}`);
    console.log(`Error while creating redis client ${JSON.stringify(error)}`);
  }
};

module.exports = {
  webSocketConnectionMap,
  makeSocketConnection,
};
