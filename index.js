require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/user");
const bodyParser = require("body-parser");

const app = express(); //middleware function
const passport = require("passport");
const session = require("express-session");

app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const mongoose = require("mongoose");
//const { initializingPassport } = require("./passportConfig");

//connect to mongoDb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

///initializingPassport(passport);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const User = require("./models/UserSchema");
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

//Routes
app.use("/api/user", userRoute);

//GET FOR REGISTER
app.get("/register", (req, res) => {
  //res.render("register");
  req.send("/");
});

// //GET FOR LOGIN
// app.get("/login", (req, res) => {
//   res.render("login");
// });

//POST FOR REGISTER

// app.post("/register", async function (req, res) {
//   try {
//     const existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       res.json({ success: false, message: "User already exists." });
//     } else {
//       const newUser = new User({
//         email: req.body.email,
//         username: req.body.username,
//       });
//       await newUser.setPassword(req.body.password);
//       const registeredUser = await newUser.save();
//       req.login(registeredUser, (err) => {
//         console.log("New user registered:", registeredUser);

//         if (err) {
//           res.json({ success: false, message: err });
//         } else {
//           passport.serializeUser(User.serializeUser());
//           passport.deserializeUser(User.deserializeUser());
//           res.json({ success: true, message: "Your account has been saved" });
//         }
//       });
//     }
//   } catch (error) {
//     console.log("Error during registration:", error);
//     res.json({ success: false, message: "An error occurred." });
//   }
// });
app.post("/register", function (req, res) {
  User.register(
    new User({ email: req.body.email, username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        res.json({
          success: false,
          message: "Your account already exist",
        });
      } else {
        req.login(user, (er) => {
          if (er) {
            res.json({ success: false, message: er });
          } else {
            passport.serializeUser(User.serializeUser());
            passport.deserializeUser(User.deserializeUser());
            res.json({ success: true, message: "Your account has been saved" });
          }
        });
      }
    }
  );
});

//POST FOR LOGIN
app.post("/login", function (req, res) {
  //res.json({ success: true, message: "You have been logged in successfully" });
  if (!req.body.username) {
    res.json({ success: false, message: "Username was not given" });
  } else if (!req.body.password) {
    res.json({ success: false, message: "Password was not given" });
  } else {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!user) {
          res.json({
            success: false,
            message: "username or password incorrect",
          });
        } else {
          res.json(
            {
              success: true,
              message: "Authentication successful",
            },
            passport.serializeUser(User.serializeUser()),
            passport.deserializeUser(User.deserializeUser())
          );
        }
      }
    })(req, res);
  }
});

// Starting the server
app.listen(3001, () => {
  console.log("Backend server is running ");
});
