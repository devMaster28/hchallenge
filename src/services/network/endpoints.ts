
const API_URL = `http://localhost:8080`;
const WEBSOCKET_URL = `ws://localhost:8080`;

export const endpoints = {
  documents: `${API_URL}/documents`,
  notifications: `${WEBSOCKET_URL}/notifications`,
} as const;
