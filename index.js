import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import passport from "passport";
import session from "express-session";
import lowdbStore from "connect-lowdb";

import db from "./db.js";

import indexRoute from "./routes/index.js";
import userRoute from "./routes/user.js";

const port = process.env.PORT || 3000;

const app = express();

const LowdbStore = lowdbStore(session);

app.set("view engine", "pug");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: new LowdbStore({ db }),
}));

app.use(passport.authenticate("session"));

app.use("/", indexRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`Passport.js lowdb server listening at http://localhost:${port}`);
});
