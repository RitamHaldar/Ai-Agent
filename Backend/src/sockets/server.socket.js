import { Server } from "socket.io";

let io = null;
export function initSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "https://axion-ai-8k1l.onrender.com",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true
        }
    })
}
export function getIO() {
    if (!io) {
        throw new Error("Socket server not initialized");
    }
    return io;
}