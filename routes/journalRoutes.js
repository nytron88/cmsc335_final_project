const express = require("express");
const JournalEntry = require("../models/JournalEntry");
const { getWeatherForCity } = require("../services/weatherService");

const router = express.Router();

router.get("/", async (req, res) => {
  const entries = await JournalEntry.find().sort({ createdAt: -1 }).limit(20);

  res.render("index", {
    title: "Weather Journal",
    entries,
    formData: {},
    error: null
  });
});

router.post("/entries", async (req, res) => {
  const { city, note } = req.body;

  try {
    if (!city || !note) {
      throw new Error("Please enter a city and a journal note.");
    }

    const weather = await getWeatherForCity(city);

    await JournalEntry.create({
      city: weather.city,
      note,
      temperature: weather.temperature,
      weatherDescription: weather.weatherDescription,
      windSpeed: weather.windSpeed
    });

    res.redirect("/");
  } catch (error) {
    const entries = await JournalEntry.find().sort({ createdAt: -1 }).limit(20);

    res.status(400).render("index", {
      title: "Weather Journal",
      entries,
      formData: { city, note },
      error: error.message
    });
  }
});

module.exports = router;
