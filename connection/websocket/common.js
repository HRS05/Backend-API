const webSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { CALL_TYPE, SOCKET_CALL_TYPE } = require("./constant");
const { isUndefinedOrNull } = require("../../utils/validators");
const url = require("url");

let webSocketConnectionMap = {};

const sendError = (data) => {
  return JSON.stringify({ error: data, type: SOCKET_CALL_TYPE.ERROR });
};

const validateUser = ({ token, ws }) => {
  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(user);
    ws.id = user.user_id; // Assign user ID to the WebSocket connection
    webSocketConnectionMap[user.user_id] = ws; // Map the user ID to the WebSocket connection
    ws.send(
      JSON.stringify({
        data: "User identified successfully!",
        type: SOCKET_CALL_TYPE.IDENTIFY,
      })
    );
  } catch (err) {
    ws.close(1008, "Invalid token");
  }
};

const makeCall = async ({ data, ws }) => {
  const { peerId, toCall, callType, type } = data;
  const userws = webSocketConnectionMap[toCall];
  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    ws.send(sendError("User not found!"));
    return;
  }
  console.log(`person exists: ${toCall}`)
  userws.send(
    JSON.stringify({
      peerId,
      callBy: ws.id,
      callType,
      type,
    })
  );
};

const callStatus = async ({ data, ws }) => {
  const { status, toCall, type } = data;
  const userws = webSocketConnectionMap[toCall];
  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    ws.send(sendError("User not found!"));
    return;
  }
  userws.send(
    JSON.stringify({
      status,
      callBy: ws.id,
      type,
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
        console.log(`socket connection got closed for id: ${ws.id}`);
        console.log(JSON.stringify(Object.keys(webSocketConnectionMap).length));
        delete webSocketConnectionMap[id];
        console.log(JSON.stringify(Object.keys(webSocketConnectionMap).length));
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
