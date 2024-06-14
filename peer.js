const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 9000, path: '/myapp' });

console.log('PeerJS server is running on port 9000');