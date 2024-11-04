import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSockets = ({ url, socketCommand, setStatus }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    // Initialize the socket connection
    const socketConnection = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketConnection.on('connect', () => {
      console.log('WebSocket connected');
      setConnectionStatus("Connected");
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus("Connection Error");
    });

    socketConnection.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnectionStatus("Disconnected");
    });

    // Listen for `pushState` responses from Volumio
    socketConnection.on('pushState', (data) => {
      console.log('Received state:', data);
      setStatus(data);  // Update the status with the latest state
    });

    setSocket(socketConnection);

    return () => {
      console.log('Cleaning up WebSocket connection...');
      socketConnection.disconnect();
    };
  }, [url]);

  useEffect(() => {
    // Send command when `socketCommand` changes
    if (socket && socketCommand) {
      if (typeof socketCommand === 'object') {
        socket.emit(socketCommand.command, socketCommand.value);
      } else {
        socket.emit(socketCommand);
      }
      console.log(`Sent command: ${JSON.stringify(socketCommand)}`);
    }
  }, [socket, socketCommand]);

  //return <div>{connectionStatus}</div>;
};

export default WebSockets;
