const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

// Load validation
const validateProfileInput = require("../../validator/profile").default;
const validateRandomProfileInput = require("../../validator/random_profile");
const isEmpty = require("../../validator/is-empty");

// Load profile model
const Profile = require("../../models/Profile");
// Load user profile model
const User = require("../../models/User");

// @route GET api/profile
// @desc Get current user profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.status(404).json({ error: "Profile not found!" });
        } else {
          res.json(profile);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route PUT api/profile
// @desc updates current user profile
// @access Private
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.username) profileFields.username = req.body.username;
    if (req.body.rank) profileFields.rank = req.body.rank;
    if (req.body.coins) profileFields.coins = req.body.coins;
    if (req.body.displayName) profileFields.displayName = req.body.displayName;
    if (req.body.activeBody) profileFields.activeBody = req.body.activeBody;
    if (req.body.activeHead) profileFields.activeHead = req.body.activeHead;
    if (req.body.activeTracks)
      profileFields.activeTracks = req.body.activeTracks;
    if (req.body.activeCannon)
      profileFields.activeCannon = req.body.activeCannon;
    if (req.body.activeHat) profileFields.activeHat = req.body.activeHat;
    if (req.body.activeExhaust)
      profileFields.activeExhaust = req.body.activeEhxaust;
    if (req.body.activePaint) profileFields.activePaint = req.body.activePaint;
    if (req.body.activeEngine)
      profileFields.activeEngine = req.body.activeEngine;
    if (typeof req.body.unlockedBodies !== "undefined") {
      profileFields.unlockedBodies = req.body.unlockedBodies.split(",");
    }
    if (typeof req.body.unlockedHeads !== "undefined") {
      profileFields.unlockedHeads = req.body.unlockedHeads.split(",");
    }
    if (typeof req.body.unlockedTracks !== "undefined") {
      profileFields.unlockedTracks = req.body.unlockedTracks.split(",");
    }
    if (typeof req.body.unlockedCannons !== "undefined") {
      profileFields.unlockedCannons = req.body.unlockedCannons.split(",");
    }
    if (typeof req.body.unlockedHats !== "undefined") {
      profileFields.unlockedHats = req.body.unlockedHats.split(",");
    }
    if (typeof req.body.unlockedExhausts !== "undefined") {
      profileFields.unlockedExhausts = req.body.unlockedExhausts.split(",");
    }
    if (typeof req.body.unlockedPaints !== "undefined") {
      profileFields.unlockedPaints = req.body.unlockedPaints.split(",");
    }
    if (typeof req.body.unlockedEngines !== "undefined") {
      profileFields.unlockedEngines = req.body.unlockedEngines.split(",");
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if username exists
        Profile.findOne({ username: profileFields.username }).then(profile => {
          if (profile) {
            errors.username = "That username already exists";
            return res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   GET api/profile/random
// @desc    Get random profiles based on filters
// @access  Public
router.post("/random", (req, res) => {
  const errors = validateRandomProfileInput(req.body);

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const limit = parseInt(req.body.amount);

  let filters = req.body.filters;
  let rules = [];

  if ("rank" in filters) {
    rules.push({ rank: filters.rank });
  }

  if ("activeEngine" in filters) {
    rules.push({ activeEngine: filters.activeEngine });
  }

  if ("activeBody" in filters) {
    rules.push({ activeBody: filters.activeBody });
  }

  if ("activeHead" in filters) {
    rules.push({ activeHead: filters.activeHead });
  }

  if ("activeTracks" in filters) {
    rules.push({ activeTracks: filters.activeTracks });
  }

  if ("activeCannon" in filters) {
    rules.push({ activeCannon: filters.activeCannon });
  }

  if ("activeHat" in filters) {
    rules.push({ activeHat: filters.activeHat });
  }

  if ("activeExhaust" in filters) {
    rules.push({ activeExhaust: filters.activeExhaust });
  }

  if ("activePaint" in filters) {
    rules.push({ activePaint: filters.activePaint });
  }

  Profile.find({
    $and: rules
  })
    .limit(limit)
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No profile matching the criteria";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: "No profile matching the criteria" })
    );
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   GET api/profile/username/:username
// @desc    Get profile by username
// @access  Public

router.get("/username/:username", (req, res) => {
  const errors = {};

  Profile.findOne({ username: req.params.username })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

router.post("/update", (req, res) => {
  res.send(typeof req.body.data);
});

module.exports = router;
