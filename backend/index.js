const express = require("express");
var cors = require('cors')
const app = express();
const mongoose = require("mongoose");
 
app.use(cors())

const familyRoute = require("./routes/family/family");
const loginRoute = require("./routes/authentication/login");
const locationRoute = require("./routes/location/location");
const todoRoute = require("./routes/todo/todo");
const galleryRoute = require("./routes/gallery/gallery");
const transactionRoute = require("./routes/transaction/transaction");
const eventRoute = require("./routes/event/event");
const getUserRoute = require("./routes/user/getUser");
const getChatRoute = require("./routes/chat/chat");
const getMessageRoute = require("./routes/message/message");

require("dotenv").config();
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("HTTP Method - " + req.method + " , URL - " + req.url);
  next();
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

//linking router files
app.use("/api/families", familyRoute);
app.use("/api/login", loginRoute);
app.use("/api/locations", locationRoute);
app.use("/api/todos", todoRoute);
app.use("/api/photos", galleryRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/events", eventRoute);
app.use("/api/user", getUserRoute);
app.use("/api/chat", getChatRoute);
app.use("/api/message", getMessageRoute);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
