import { io } from "socket.io-client";

export function initializeSocket() {
    const socket = io("http://localhost:3000", {
        withCredentials: true
    });
    socket.on("connect", () => {
        console.log("Connected to server");
    });
    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });
}