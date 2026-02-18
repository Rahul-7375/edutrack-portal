const { getPool } = require("./db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { full_name, email, password, role } = req.body;
    const pool = getPool();

    const sql =
      "INSERT INTO accounts (full_name, email, password, role) VALUES ($1, $2, $3, $4)";
    await pool.query(sql, [full_name, email, password, role]);

    res.status(200).send("Registration successful");
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === "23505") {
      res.status(400).send("Email already exists");
    } else {
      res.status(500).send("Registration failed: " + error.message);
    }
  }
};
