// WebSockets.js

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSockets = ({ url, socketCommand, setResponseState, setResponseQueue }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketConnection.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socketConnection.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Listen for the pushQueue event for queue data
    socketConnection.on('pushQueue', (data) => {
      console.log('Received queue data:', data); // Debug log
      setResponseQueue(data);  // Ensure this updates the queue state in the parent
    });

    // Listen for the pushState event for playback state
    socketConnection.on('pushState', (data) => {
      console.log('Received state data:', data); // Debug log
      setResponseState(data);
    });

    setSocket(socketConnection);

    return () => {
      console.log('Cleaning up WebSocket connection...');
      socketConnection.disconnect();
    };
  }, [url]);

  // Send command when socketCommand changes
  useEffect(() => {
    if (socket && socketCommand) {
      if (typeof socketCommand === 'object') {
        socket.emit(socketCommand.command, socketCommand.value);
      } else {
        socket.emit(socketCommand);
      }
      console.log(`Sent command: ${JSON.stringify(socketCommand)}`);
    }
  }, [socket, socketCommand]);

  //return <div>WebSocket Connection Status</div>;
};

export default WebSockets;
