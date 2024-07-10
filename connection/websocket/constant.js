const SOCKET_CALL_TYPE = {
    IDENTIFY: 'identify',
    CALL: 'call',
    CALL_STATUS: 'call-status',
    USER_STATUS: 'user-status',
    CHAT: 'chat',
    ERROR: 'error',
    CALL_END: 'call-end',
    SOCKET_TASK: 'talk'
}

const CALL_TYPE = {
    AUDIO: 'audio',
    VIDEO: 'video'
}

module.exports = {
    SOCKET_CALL_TYPE,
    CALL_TYPE
}