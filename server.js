require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", journalRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "That page does not exist."
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Weather Journal is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();
