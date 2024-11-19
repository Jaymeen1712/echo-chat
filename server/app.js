const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 4000;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Mount the user routes
app.use("/users", userRoutes);
