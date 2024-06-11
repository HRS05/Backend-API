const SOCKET_CALL_TYPE = {
    IDENTIFY: 'identify',
    CALL: 'call',
    CALL_STATUS: 'call-status',
    ERROR: 'error',
    CALL_END: 'call-end',
}

const CALL_TYPE = {
    AUDIO: 'audio',
    VIDEO: 'video'
}

module.exports = {
    SOCKET_CALL_TYPE,
    CALL_TYPE
}