import "dotenv/config";
import { randomBytes, scrypt } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low, JSONFile } from "lowdb";

const __dirname = dirname(fileURLToPath(import.meta.url));

const saltLen = +process.env.SALT_LEN || 64;
const keyLen = +process.env.KEY_LEN || 64;

const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();

db.data ||= { users: [] };

if (db.data.users.length === 0) {
  randomBytes(saltLen, (saltErr, saltBuf) => {
    if (saltErr) return console.error(saltErr);
    const salt = saltBuf.toString("hex");

    scrypt("admin", salt, keyLen, async (pwHashErr, pwHashBuf) => {
      if (pwHashErr) return console.error(pwHashErr);
      const pwHash = pwHashBuf.toString("hex");

      db.data.users.push({
        username: "admin",
        passwordHash: pwHash,
        salt,
      });

      await db.write();
    });
  });
}

export default db;
