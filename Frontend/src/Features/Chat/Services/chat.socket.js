import { io } from "socket.io-client";

let socketInstance = null;

export function initializeSocket() {
    if (!socketInstance) {
        socketInstance = io("https://axion-ai-h2ll.onrender.com", {
            withCredentials: true
        });

        socketInstance.on("connect", () => {
            console.log("Connected to server");
        });

        socketInstance.on("disconnect", () => {
            console.log("Disconnected from server");
        });
    }
}

export function getSocket() {
    return socketInstance;
}
