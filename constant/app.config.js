module.exports = {
    APP_SESSION_SECRET: 'earnizy',

    ALLOWED_REQUEST_TYPES: [
        'POST', 'GET', 'PUT', 'DELETE', 'PATCH',
    ],

    ALLOWED_HEADERS: [
        // common headers
        'Accept',
        'Accept-Encoding',
        'Accept-Language',
        'Origin',
        'Referer',
        'User-Agent',
        'Content-Type',

        // custom headers
        'X-AUTH-TOKEN',
        'X-USER-TYPE',
    ],

    MAX_UPLOAD_SIZE: 2e+7, // ~ 20MB
};
