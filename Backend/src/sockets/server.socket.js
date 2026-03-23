import { Server } from "socket.io";

let io = null;
export function initSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "https://axion-ai-h2ll.onrender.com",
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