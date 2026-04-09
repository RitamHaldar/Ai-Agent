import { io } from "socket.io-client";

let socketInstance = null;

export function initializeSocket() {
    if (!socketInstance) {
        socketInstance = io("http://localhost:3000", {
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
