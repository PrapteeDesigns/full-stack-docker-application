const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

let db;

async function initDB() {
  let retries = 10;

  while (retries) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100)
        )
      `);
      console.log("Connected to MySQL");
      break;
    } catch (err) {
    console.log("Connection error",err.message);

      console.log("Waiting for MySQL...");
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!retries) throw new Error("Could not connect to MySQL");
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  await db.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  res.json({ message: "User added successfully" });
});

app.get("/users", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM users");
  res.json(rows);
});

const PORT = 3000;

app.listen(PORT, async () => {
  await initDB();
  console.log(`Backend running on port ${PORT}`);
});