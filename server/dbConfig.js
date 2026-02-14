require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Rahul@2004",
  database: process.env.DB_NAME || "edutrack_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database Error:", err.message);
  } else {
    console.log("Database Connected");
  }
});

module.exports = db;
