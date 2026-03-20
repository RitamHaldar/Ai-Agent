import "dotenv/config"
import app from "./src/app.js";
import { Connecttodb } from "./src/config/database.js";
import http from "http"
import { initSocketServer } from "./src/sockets/server.socket.js";

Connecttodb();
const httpServer = http.createServer(app);
initSocketServer(httpServer);
httpServer.listen(3000, () => {
    console.log("Server running at port 3000")
})
