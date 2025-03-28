// server.js

const WebSocket = require('ws');
//CAMBIAR IP POR LA IP DE MI PC
const wss = new WebSocket.Server({ port: 9090, host: '192.168.0.10' });

let count = 0;

wss.on('connection', function connection(ws) {
    // Envía el contador actual a la nueva conexión
    ws.send(JSON.stringify({ type: 'count', data: count }));

    // Maneja los mensajes recibidos desde el cliente
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if (data.type === 'increment') {
            // Incrementa el contador externo según el valor enviado desde el cliente
            count += data.value;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'count', data: count }));
                }
            });
        } else if (data.type === 'reset') { // Maneja el reinicio del contador
            count = 0;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'count', data: count }));
                }
            });
        }
    });
});
