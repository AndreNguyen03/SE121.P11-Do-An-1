import express from "express";
import cors from "cors";
import Database from "./dbs/init.mongodb.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoutes from './routes/user.routes.js'
import ipfsRoutes from './routes/ipfs.routes.js'
import notiRoutes from './routes/notification.routes.js'
import nftRoutes from './routes/nft.routes.js'
import { listenToTransfers } from "./listeners/nftListener.js";
import path from 'path';
import url from 'url';


// app config
const app = express();

// Lấy đường dẫn thư mục hiện tại
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// // middleware
app.use(express.json()); //
app.use(
  cors({
    origin: 'http://localhost:5173',  // Địa chỉ frontend của bạn
    methods: ['GET', 'POST']
  })
);
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' blob: http://localhost:3056; script-src 'self' 'unsafe-inline'; connect-src 'self' ws: http: https:;");
  next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes); // Gắn route vào app
app.use('/api/ipfs', ipfsRoutes);
app.use('/api/notifications', notiRoutes);
app.use('/api/nft', nftRoutes);

listenToTransfers();

// db connetion
Database.getInstance();

// api endpoints
app.get("/", (req, res) => {
  res.send("API working");
});

export default app;