const webSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { CALL_TYPE, SOCKET_CALL_TYPE } = require("./constant");
const { isUndefinedOrNull } = require("../../utils/validators");
const url = require("url");
const {
  makeCall,
  sendChat,
  userStatus,
  callStatus,
  socketTask
} = require("./communication");

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

const makeSocketConnection = async (server) => {
  try {
    // Creating WebSocket server
    const wss = new webSocket.Server({ server });

    wss.on("connection", function connection(ws, req) {
      const parameters = url.parse(req.url, true).query;
      const token = parameters.token;
      validateUser({ token, ws });

      // Set interval to send ping messages every 25 seconds
      const keepAliveInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.ping();
          console.log(`Sent keep-alive ping to ${ws.id}`);
        }
      }, 25000);

      ws.on("message", async function incoming(message) {
        try {
          const data = JSON.parse(message);
          console.log(`data send by data: ${ws.id}`);
          console.log(data);
          switch (data.type) {
            case SOCKET_CALL_TYPE.CALL:
              await makeCall({ data, ws, webSocketConnectionMap });
              break;
            case SOCKET_CALL_TYPE.CALL_STATUS:
              await callStatus({ data, ws, webSocketConnectionMap });
              break;
            case SOCKET_CALL_TYPE.CHAT:
              await sendChat({ data, ws, webSocketConnectionMap });
              break;
            case SOCKET_CALL_TYPE.USER_STATUS:
              await userStatus({ data, ws, webSocketConnectionMap });
              break;
            case SOCKET_CALL_TYPE.SOCKET_TASK:
              await socketTask({ data, ws, webSocketConnectionMap });
              break;
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });

      ws.on("close", () => {
        if (isUndefinedOrNull(ws.id)) {
          return;
        }
        clearInterval(keepAliveInterval); // Clear interval when connection closes
        const id = ws.id;
        console.log(`Socket connection got closed for id: ${ws.id}`);
        console.log(JSON.stringify(Object.keys(webSocketConnectionMap).length));
        delete webSocketConnectionMap[id];
        console.log(JSON.stringify(Object.keys(webSocketConnectionMap).length));
      });
    });
  } catch (error) {
    console.log(`Error while creating redis client ${JSON.stringify(error)}`);
  }
};

module.exports = {
  webSocketConnectionMap,
  makeSocketConnection,
};
