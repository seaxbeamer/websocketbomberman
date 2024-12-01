const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const players = {};

server.on('connection', (socket) => {
    let playerId = Math.random().toString(36).substring(2);
    players[playerId] = socket;

    console.log(`Player connected: ${playerId}`);
    socket.send(JSON.stringify({ type: 'connected', playerId }));

    socket.on('message', (data) => {
        const message = JSON.parse(data);

        if (message.type === 'move') {
            Object.values(players).forEach((player) => {
                if (player !== socket) {
                    player.send(JSON.stringify({ type: 'move', ...message }));
                }
            });
        }
    });

    socket.on('close', () => {
        delete players[playerId];
        console.log(`Player disconnected: ${playerId}`);
    });
});