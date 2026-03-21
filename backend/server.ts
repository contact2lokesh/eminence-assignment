import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server is running on  http://localhost:${PORT}`);
});
