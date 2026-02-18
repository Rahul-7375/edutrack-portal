const { getPool } = require("./db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT account_id, full_name FROM accounts WHERE role = 'student' ORDER BY full_name",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).send("Failed to fetch students: " + error.message);
  }
};
