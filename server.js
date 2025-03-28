const WebSocket = require('ws');

// Usamos el puerto asignado dinámicamente por Railway
const port = process.env.PORT || 9090;  // Usa el puerto proporcionado por Railway o un puerto local si no está definido
const wss = new WebSocket.Server({ port: port });

let count = 0;

wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify({ type: 'count', data: count }));

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if (data.type === 'increment') {
            count += data.value;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'count', data: count }));
                }
            });
        } else if (data.type === 'reset') {
            count = 0;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'count', data: count }));
                }
            });
        }
    });
});

console.log(`Server running on port ${port}`);
