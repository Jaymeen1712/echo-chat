const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/routes");

const app = express();
const port = process.env.PORT || 4000;

const Cors = require("cors");
const router = require("./routes/routes");

mongoose.connect(
  "mongodb+srv://jaymeensonara:5ed9Doa5idL3hDxY@personal-use-cluster.icpal.mongodb.net/chat-app-db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Database Connection Established!");
});

app.use(express.json());
app.use(Cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/chat-service", router);
