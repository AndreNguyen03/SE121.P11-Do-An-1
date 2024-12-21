import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3056";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Sử dụng WebSocket
  reconnection: true, // Tự động kết nối lại nếu bị mất
});

export default socket;