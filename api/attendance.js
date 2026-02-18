const { getPool } = require("./db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const pool = getPool();

  try {
    const urlParts = req.url.split("?");
    const queryParams = new URLSearchParams(urlParts[1] || "");
    const studentId = queryParams.get("studentId");
    const id = queryParams.get("id");

    // GET attendance by student ID
    if (req.method === "GET" && studentId) {
      const result = await pool.query(
        `
        SELECT TO_CHAR(attendance_date, 'YYYY-MM-DD') AS date,
               attendance_status AS status
        FROM attendance_history
        WHERE student_id = $1
        ORDER BY attendance_date DESC
      `,
        [studentId],
      );
      return res.json(result.rows);
    }

    // GET all attendance
    if (req.method === "GET") {
      const result = await pool.query(`
        SELECT history_id,
               student_id,
               faculty_id,
               TO_CHAR(attendance_date, 'YYYY-MM-DD') AS date,
               attendance_status AS status
        FROM attendance_history
        ORDER BY attendance_date DESC
      `);
      return res.json(result.rows);
    }

    // POST new attendance
    if (req.method === "POST") {
      const { student_id, faculty_id, attendance_date, attendance_status } =
        req.body;
      const result = await pool.query(
        "INSERT INTO attendance_history (student_id, faculty_id, attendance_date, attendance_status) VALUES ($1, $2, $3, $4) RETURNING history_id",
        [student_id, faculty_id, attendance_date, attendance_status],
      );
      return res.json({
        message: "Attendance added",
        id: result.rows[0].history_id,
      });
    }

    // PUT update attendance
    if (req.method === "PUT" && id) {
      const { attendance_status } = req.body;
      await pool.query(
        "UPDATE attendance_history SET attendance_status = $1 WHERE history_id = $2",
        [attendance_status, id],
      );
      return res.send("Attendance updated successfully");
    }

    // DELETE attendance
    if (req.method === "DELETE" && id) {
      await pool.query("DELETE FROM attendance_history WHERE history_id = $1", [
        id,
      ]);
      return res.send("Attendance deleted successfully");
    }

    res.status(400).json({ error: "Bad request" });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).send("Server error: " + error.message);
  }
};
