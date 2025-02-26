const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require("path");

const authRoutes = require("./routes/auth-routes");
const messageRoutes = require("./routes/message-routes");
const { app, server } = require("./lib/socket");

dotenv.config();

app.use(express.json());  // for parsing request body
app.use(cookieParser());  // for parsing cookies

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true  // allows cookies to be sent in requests
})); 

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));