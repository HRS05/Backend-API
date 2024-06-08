const webSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let webSocketConnectionMap = {};


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
          if (data.type === 'identify') {
            // Assuming the message contains a type 'identify' and userId
            const token = data.token;        
            try {
                const user = jwt.verify(token, process.env.TOKEN_KEY);
                console.log(user);
                ws.id = user.user_id; // Assign user ID to the WebSocket connection
                webSocketConnectionMap[user.user_id] = ws; // Map the user ID to the WebSocket connection
                ws.send('User identified successfully!');
              } catch (err) {
                ws.send('User not found!');
            }
          }
          if (data.type === 'call') {
            const { peerId, toCall, callType } = data;
            const userws = webSocketConnectionMap[toCall];
            userws.send(JSON.stringify({
                peerId,
                callBy: userws.id,
                callType
            }))
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
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
