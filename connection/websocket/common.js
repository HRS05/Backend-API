const webSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { CALL_TYPE, SOCKET_CALL_TYPE } = require('./constant'); 
const { isUndefinedOrNull } = require("../../utils/validators");
let webSocketConnectionMap = {};


const validateUser = async ({ data, ws }) => {
  const token = data.token;
  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(user);
    ws.id = user.user_id; // Assign user ID to the WebSocket connection
    webSocketConnectionMap[user.user_id] = ws; // Map the user ID to the WebSocket connection
    ws.send("User identified successfully!");
  } catch (err) {
    ws.send("User not found!");
  }
};

const makeCall = async ({ data, ws }) => {
  const { peerId, toCall, callType } = data;
  const userws = webSocketConnectionMap[toCall];
  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    ws.send("User not found!");
    return;
  }
  console.log(userws);
  userws.send(
    JSON.stringify({
      peerId,
      callBy: userws.id,
      callType,
    })
  );
}


const makeSocketConnection = async (server) => {
  try {
    //creating websocket server
    const wss = new webSocket.Server({ server });
    wss.on("connection", function connection(ws) {
      console.log("A new client Connected!");
      ws.send("Welcome New Client!");

      ws.on('message', async function incoming(message) {
        try {
          const data = JSON.parse(message);
          console.log(data);
            switch (data.type) {
                case SOCKET_CALL_TYPE.IDENTIFY:
                    await validateUser({ data, ws })
                case SOCKET_CALL_TYPE.CALL:
                    await makeCall({ data, ws })
            }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });

    });
  } catch (error) {
    //Logger.error(`Error while creating redis client ${JSON.stringify(error)}`);
    console.log(`Error while creating redis client ${JSON.stringify(error)}`);
  }
};


module.exports = {
    webSocketConnectionMap,
    makeSocketConnection
};
