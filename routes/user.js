import { scrypt, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import db from "../db.js";

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

export default router;
