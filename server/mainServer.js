const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./dbConfig");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/login.html"));
});

/* ================= AUTH ================= */

// SIGNUP
app.post("/register", (req, res) => {
  const { full_name, email, password, role } = req.body;

  const sql =
    "INSERT INTO accounts (full_name,email,password,role) VALUES (?,?,?,?)";

  db.query(sql, [full_name, email, password, role], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Registration failed");
    }
    res.send("Registration successful");
  });
});

// LOGIN
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  console.log(`[DEBUG] Login Attempt: Email=${email}, Password=${password}`);

  const sql = "SELECT * FROM accounts WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("[DEBUG] Login Error:", err);
      return res.status(500).send("Login error");
    }

    if (result.length === 0) {
      console.log("[DEBUG] Login Failed: Invalid credentials");
      return res.status(401).send("Invalid credentials");
    }

    console.log("[DEBUG] Login Success:", result[0]);
    res.json(result[0]);
  });
});

/* ================= ATTENDANCE CRUD ================= */

// CREATE
app.post("/attendance", (req, res) => {
  const { student_id, faculty_id, attendance_date, attendance_status } =
    req.body;

  const sql = `
    INSERT INTO attendance_history
    (student_id, faculty_id, attendance_date, attendance_status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [student_id, faculty_id, attendance_date, attendance_status],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Insert failed");
      }
      res.json({ message: "Attendance added", id: result.insertId });
    },
  );
});

// READ ALL (Faculty)
app.get("/attendance", (req, res) => {
  const sql = `
    SELECT history_id,
           student_id,
           faculty_id,
           DATE_FORMAT(attendance_date,'%Y-%m-%d') AS date,
           attendance_status AS status
    FROM attendance_history
    ORDER BY attendance_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Fetch failed");
    }
    res.json(results);
  });
});

// GET ATTENDANCE BY STUDENT ID (Student)
app.get("/attendance/:studentId", (req, res) => {
  const { studentId } = req.params;

  const sql = `
    SELECT 
      DATE_FORMAT(attendance_date, '%Y-%m-%d') AS date,
      attendance_status AS status
    FROM attendance_history
    WHERE student_id = ?
    ORDER BY attendance_date DESC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error("Fetch Student Attendance Error:", err);
      res.status(500).send("Failed to fetch records");
    } else {
      res.json(results);
    }
  });
});

// UPDATE
app.put("/attendance/:id", (req, res) => {
  const { id } = req.params;
  const { attendance_status } = req.body;

  const sql = `
    UPDATE attendance_history
    SET attendance_status = ?
    WHERE history_id = ?
  `;

  db.query(sql, [attendance_status, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Update failed");
    }
    res.send("Attendance updated successfully");
  });
});

// GET ALL STUDENTS (Faculty)
app.get("/students", (req, res) => {
  const sql =
    "SELECT account_id, full_name FROM accounts WHERE role = 'student'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch Students Error:", err);
      res.status(500).send("Failed to fetch students");
    } else {
      res.json(results);
    }
  });
});

// DELETE
app.delete("/attendance/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM attendance_history
    WHERE history_id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Delete failed");
    }
    res.send("Attendance deleted successfully");
  });
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
