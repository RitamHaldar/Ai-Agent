import "dotenv/config"
import app from "./src/app.js";
import { Connecttodb } from "./src/config/database.js";

Connecttodb();
app.listen(3000, () => {
    console.log("Server running at port 3000")
})