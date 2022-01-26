const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
app.use(express.json());
require("./passport-setup");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("You are not logged in");
});

app.get("/failed", (req, res) => {
  res.send("You failed to authenticate");
});

app.get("/good", isLoggedIn, (req, res) => {
  res.send(`You are authenticated ${req.user.email}`);
});

//******************** */

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/good");
  }
);

app.get("/logout", (req, res) => {
  req.sesion = null;
  req.logout();
  req.redirect("/");
});

app.listen(4050, () => {
  console.log("Server is running on port 3000");
});
