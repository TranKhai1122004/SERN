import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import initWebRoutes from "./route/web";
import cors from "cors";
require("dotenv").config();

let app = express();

// ✅ Chỉ giữ cors() thôi
app.use(cors({
    
    origin: process.env.URL_REACT,  // "https://trankhai-sern.vercel.app"
    credentials: true
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Khởi tạo view engine và route
viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Backend Nodejs is running on the port : " + port);
});
