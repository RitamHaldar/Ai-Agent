import "dotenv/config"
import app from "./src/app.js";
import { Connecttodb } from "./src/config/database.js";
import http from "http"
import { initSocketServer } from "./src/sockets/server.socket.js";

Connecttodb();
const httpServer = http.createServer(app);
initSocketServer(httpServer);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})
