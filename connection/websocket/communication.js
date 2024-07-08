require("dotenv").config();
const { isUndefinedOrNull } = require("../../utils/validators");
const { chatModule } = require("../../modules/index");

const sendError = (data) => {
  return JSON.stringify({ error: data, type: SOCKET_CALL_TYPE.ERROR });
};

const makeCall = async ({ data, ws, webSocketConnectionMap }) => {
  const { peerId, toCall, callType, type } = data;
  const userws = webSocketConnectionMap[toCall];
  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    ws.send(sendError("User not found!"));
    return;
  }
  console.log(`person exists: ${toCall}`);
  userws.send(
    JSON.stringify({
      peerId,
      callBy: ws.id,
      callType,
      type,
    })
  );
};

const sendChat = async ({ data, ws, webSocketConnectionMap }) => {
  const { toCall, type, message, url, chatType, sentTime } = data;
  const userws = webSocketConnectionMap[toCall];

  //adding chat message into db
  await chatModule.chatService.sendMessage({
    reciverId: toCall,
    senderId: ws.id,
    message,
    type: chatType,
    url,
    sentTime,
  });

  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    //ws.send(sendError("User is offline!"));
    return;
  }
  console.log(`person exists: ${toCall}`);
  userws.send(
    JSON.stringify({
      callBy: ws.id,
      message,
      url,
      chatType,
      type,
      sentTime,
    })
  );
};

const userStatus = async ({ data, ws, webSocketConnectionMap }) => {
  const { toCall, type } = data;
  const userws = webSocketConnectionMap[toCall];

  if (isUndefinedOrNull(userws)) {
    // TODO: have to make notification entry
    userws.send(
      JSON.stringify({
        status: "OFFLINE",
        type,
      })
    );
    return;
  }
  userws.send(
    JSON.stringify({
      status: "ONLINE",
      type,
    })
  );
};

const callStatus = async ({ data, ws, webSocketConnectionMap }) => {
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

module.exports = {
  makeCall,
  sendChat,
  userStatus,
  callStatus,
};
