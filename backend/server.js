const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

// index route
app.get("/", (req, res) => {
  console.log(process.NODE_ENV);
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// error handler // 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(process.env.NODE_ENV);
  console.log(`Server is running on  http://localhost:${PORT}`);
});