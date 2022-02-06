import { randomBytes, scrypt } from "node:crypto";
import { Router } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import db from "../db.js";

const saltLen = +process.env.SALT_LEN || 64;
const keyLen = +process.env.KEY_LEN || 64;

const router = Router();

passport.use(new LocalStrategy(async (username, password, cb) => {
  await db.read();

  const dbUser = db.data.users.find(user => user.username === username);

  if (!dbUser) {
    return cb(null, false, { message: "Wrong username and/or password." });
  }

  scrypt(
    password,
    dbUser.salt,
    dbUser.passwordHash.length / 2,
    (pwHashErr, pwHashBuf) => {
      if (pwHashErr) return cb(pwHashErr);
      const pwHash = pwHashBuf.toString("hex");
      if (pwHash !== dbUser.passwordHash) {
        return cb(null, false, { message: "Wrong username and/or password. "});
      }

      return cb(null, dbUser);
    }
  );
}));

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.username, username: user.username });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

router.get("/log-in", (req, res) => {
  res.render("user/log-in");
});

router.post(
  "/log-in",
  passport.authenticate(
    "local",
    { successRedirect: "/", failureRedirect: "/user/log-in" }
  ),
);

router.post("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/sign-up", (req, res) => {
  res.render("user/sign-up");
});

router.post("/sign-up", async (req, res, next) => {
  if (req.body.username === "") {
    return next({
      status: 422,
      message: "Username cannot be blank. Please enter a username.",
    });
  }

  if (req.body.password === "") {
    return next({
      status: 422,
      message: "Password cannot be blank. Please enter a password.",
    });
  }

  await db.read();

  const existingUserIx = db.data.users
    .findIndex(user => user.username === req.body.username);
  
  if (existingUserIx !== -1) {
    return next({
      status: 409,
      message: "That username is already taken. Please choose another.",
    });
  } 

  if (req.body.password !== req.body.retypePassword) {
    return next({
      status: 422,
      message: "The passwords you entered do not match. Please try again.",
    });
  }

  randomBytes(saltLen, (saltErr, saltBuf) => {
    if (saltErr) return console.error(saltErr);
    const salt = saltBuf.toString("hex");

    scrypt(req.body.password, salt, keyLen, async (pwHashErr, pwHashBuf) => {
      if (pwHashErr) return console.error(pwHashErr);
      const pwHash = pwHashBuf.toString("hex");

      db.data.users.push({
        username: req.body.username,
        passwordHash: pwHash,
        salt,
      });

      await db.write();

      const user = {
        username: req.body.username,
      };

      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.redirect("/");
      });
    });
  });
});

export default router;
