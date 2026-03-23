import { io } from "socket.io-client";

export function initializeSocket() {
    const socket = io("https://axion-ai-h2ll.onrender.com", {
        withCredentials: true
    });
    socket.on("connect", () => {
        console.log("Connected to server");
    });
    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });
}