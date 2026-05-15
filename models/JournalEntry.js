const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true
    },
    note: {
      type: String,
      required: true,
      trim: true
    },
    temperature: {
      type: Number,
      required: true
    },
    weatherDescription: {
      type: String,
      required: true
    },
    windSpeed: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
