const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  username: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
    max: 40,
    min: 6
  },
  displayName: {
    type: String,
    default: "Player"
  },
  rank: {
    type: String,
    default: "unranked"
  },
  coins: {
    type: Number,
    default: 0
  },
  activeBody: {
    type: Number,
    default: 0
  },

  activeHead: {
    type: Number,
    default: 0
  },
  activeTracks: {
    type: Number,
    default: 0
  },
  activeCannon: {
    type: Number,
    default: 0
  },
  activeHat: {
    type: Number,
    default: 0
  },
  activeExhaust: {
    type: Number,
    default: 0
  },
  activePaint: {
    type: Number,
    default: 0
  },
  unlockedBodies: {
    type: [Number],
    default: []
  },
  unlockedHeads: {
    type: [Number],
    default: []
  },
  unlockedTracks: {
    type: [Number],
    default: []
  },
  unlockedCannons: {
    type: [Number],
    default: []
  },
  unlockedHats: {
    type: [Number],
    default: []
  },
  unlockedExhausts: {
    type: [Number],
    default: []
  },
  unlockedPaints: {
    type: [Number],
    default: []
  },
  activeEngine: {
    type: Number,
    default: 0
  },
  unlockedEngines: {
    type: [Number],
    default: []
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
