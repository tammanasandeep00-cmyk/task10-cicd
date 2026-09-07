const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "mysql"
};

app.get("/", (req, res) => {
  res.json({
    application: "Task 10 Backend",
    status: "UP"
  });
});

app.get("/health", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query("SELECT 1");
    await connection.end();

    res.json({
      status: "UP",
      application: "Task 10 Backend",
      database: "Connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "DOWN",
      application: "Task 10 Backend",
      database: "Disconnected"
    });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    await connection.end();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database operation failed"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Task 10 Backend running on port ${PORT}`);
});
