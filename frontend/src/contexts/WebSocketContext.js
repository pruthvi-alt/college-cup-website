import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [liveScores, setLiveScores] = useState({});
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptsRef = useRef(0);

  // For demo purposes, we'll simulate WebSocket functionality
  // In a real app, this would connect to your WebSocket server
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Simulate WebSocket connection
        console.log('Attempting to connect to WebSocket...');
        
        // Mock WebSocket object for demonstration
        const mockSocket = {
          send: (data) => {
            console.log('WebSocket send:', data);
          },
          close: () => {
            console.log('WebSocket closed');
            setIsConnected(false);
          },
          readyState: 1 // OPEN state
        };

        setSocket(mockSocket);
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        console.log('WebSocket connected (simulated)');

        // Simulate receiving live data
        const simulateData = () => {
          // Simulate live score updates
          const mockScores = {
            match_1: {
              team1: 'Fire Dragons',
              team2: 'Golden Eagles',
              score1: Math.floor(Math.random() * 100),
              score2: Math.floor(Math.random() * 100),
              status: 'live',
              lastUpdate: new Date().toISOString()
            }
          };
          
          setLiveScores(mockScores);

          // Simulate notifications
          const mockNotifications = [
            {
              id: Date.now(),
              type: 'score_update',
              message: 'Live score updated for Fire Dragons vs Golden Eagles',
              timestamp: new Date().toISOString()
            }
          ];

          setNotifications(prev => [...mockNotifications, ...prev.slice(0, 4)]);
        };

        // Simulate data updates every 10 seconds
        const interval = setInterval(simulateData, 10000);
        simulateData(); // Initial data

        return () => {
          clearInterval(interval);
        };

      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
        
        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
            connectWebSocket();
          }, timeout);
        }
      }
    };

    const cleanup = connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket && socket.close) {
        socket.close();
      }
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  // Send message through WebSocket
  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
      return false;
    }
  };

  // Subscribe to specific events
  const subscribeToMatch = (matchId) => {
    return sendMessage({
      type: 'subscribe',
      event: 'match_updates',
      matchId: matchId
    });
  };

  const unsubscribeFromMatch = (matchId) => {
    return sendMessage({
      type: 'unsubscribe',
      event: 'match_updates',
      matchId: matchId
    });
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Remove specific notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const value = {
    socket,
    isConnected,
    notifications,
    liveScores,
    sendMessage,
    subscribeToMatch,
    unsubscribeFromMatch,
    clearNotifications,
    removeNotification
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
