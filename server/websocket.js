const WebSocket = require('ws');

let wss = null;
const clients = new Set();

function initializeWebSocket(server) {
  wss = new WebSocket.Server({ 
    server,
    path: '/ws',
    clientTracking: true
  });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected from:', req.socket.remoteAddress);
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Expedia Strategic Advisory Platform',
      timestamp: new Date().toISOString()
    }));

    // Handle client messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('Received WebSocket message:', message);
        
        // Echo back for now, can add specific handling later
        ws.send(JSON.stringify({
          type: 'echo',
          data: message,
          timestamp: new Date().toISOString()
        }));
        
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
      }
    });

    // Handle connection close
    ws.on('close', (code, reason) => {
      console.log(`WebSocket client disconnected: ${code} ${reason}`);
      clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });

    // Send periodic ping to keep connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000); // 30 seconds

    ws.on('close', () => {
      clearInterval(pingInterval);
    });
  });

  wss.on('error', (error) => {
    console.error('WebSocket Server error:', error);
  });

  console.log('🔌 WebSocket server initialized on /ws');
}

function broadcastToClients(message) {
  if (!wss) {
    console.warn('WebSocket server not initialized');
    return;
  }

  const data = typeof message === 'string' ? message : JSON.stringify(message);
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (error) {
        console.error('Error sending message to client:', error);
        clients.delete(client);
      }
    } else {
      clients.delete(client);
    }
  });
  
  console.log(`📡 Broadcasted to ${clients.size} clients`);
}

function getConnectedClientsCount() {
  return clients.size;
}

function closeAllConnections() {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1000, 'Server shutting down');
    }
  });
  clients.clear();
  
  if (wss) {
    wss.close();
  }
}

module.exports = {
  initializeWebSocket,
  broadcastToClients,
  getConnectedClientsCount,
  closeAllConnections
};