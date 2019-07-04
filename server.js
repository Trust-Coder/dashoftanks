const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to mongooDB
mongoose
  .connect(db)
  .then(() => console.log("MongooDB Connected"))
  .catch(err => console.log(err));

//Passport Middleware
passport.initialize();

// passport configuration
require("./config/passport")(passport);

app.get("/", (req, res) => res.send("Dash of Tanks"));

app.use("/api/users", users);
app.use("/api/profile", profile);

const port = process.env.PORT || 80;

app.listen(port, () => console.log("Server running on port " + port));
