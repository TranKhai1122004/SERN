import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import initWebRoutes from "./route/web";
import cors from 'cors';
require("dotenv").config(); // dùng để chạy câu lệnh let port ở dưới 
let app = express();

app.use(cors({
    origin: [
        
        'https://trankhai-serm.vercel.app'
    ],
    credentials: true
}));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

    res.setHeader('Access-Control-Allow-methods', 'Get, Post, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Khởi tạo view engine và route
viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Backend Nodejs is running on the port : " + port);
});