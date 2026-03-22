import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger';

// routes //
import authRoutes from './routes/authRoutes';
import transferRoutes from "./routes/transferRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
   cors: {
        origin: 'http://localhost:4200',
        credentials: true
    }
});

app.set('io', io);
setupSwagger(app);

io.on('connection', (socket)=>{
  socket.on('join', (userId: string)=>{
    console.log(`Socket connection establist :- ${userId}`);
    if(userId) socket.join(userId); 
  });
});

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
    const dbUser = process.env.DB_USERNAME || '';
    const dbPass = process.env.DB_PASSWORD || '';
    mongoURI = mongoURI.replace('<db_username>', dbUser).replace('<db_password>', encodeURIComponent(dbPass));
    console.log(mongoURI);
    mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.error('MONGODB_URI is not defined in the environment variables.');
}

// index route
app.get("/", (req, res) => {
  console.log(process.env.NODE_ENV);
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// error handler // 
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

import userRoutes from './routes/userRoutes';

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/balance", transferRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server is running on  http://localhost:${PORT}`);
});
