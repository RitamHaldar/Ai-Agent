import { Server } from "socket.io";

let io = null;
export function initSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
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