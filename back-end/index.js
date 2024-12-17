import express from "express";
import cors from "cors";
import Database from "./dbs/init.mongodb.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoutes from './routes/user.routes.js'
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
  cors(
    {
      origin: ["http://localhost:5173"],
      methods: ["POST", "GET"],
      credentials: true,
    }
    // set cors như này thì mới gửi token qua được
  )
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes); // Gắn route vào app

// db connetion
Database.getInstance();

// api endpoints
app.get("/", (req, res) => {
  res.send("API working");
});

export default app;