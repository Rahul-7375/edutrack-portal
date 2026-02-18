const API_BASE = "/api";
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "index.html";
}

document.getElementById("welcome").innerText =
  `Welcome ${user.full_name} (${user.role})`;

if (user.role === "faculty") {
  document.getElementById("facultyPanel").style.display = "block";
  loadAttendance();
  fetchStudents();
} else if (user.role === "student") {
  document.getElementById("studentPanel").style.display = "block";
  loadStudentAttendance(user.account_id);
}

function fetchStudents() {
  fetch(`${API_BASE}/students`)
    .then((res) => res.json())
    .then((students) => {
      const select = document.getElementById("studentId");
      select.innerHTML = '<option value="">Select Student</option>';
      students.forEach((student) => {
        const option = document.createElement("option");
        option.value = student.account_id;
        option.innerText = `${student.full_name} (ID: ${student.account_id})`;
        select.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Error fetching students:", err);
      alert("Failed to load students");
    });
}

function markAttendance() {
  const studentId = document.getElementById("studentId").value;
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;

  if (!studentId || !date) {
    alert("Please select student and date");
    return;
  }

  fetch(`${API_BASE}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      faculty_id: user.account_id,
      attendance_date: date,
      attendance_status: status,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Attendance Added");
      document.getElementById("studentId").value = "";
      document.getElementById("date").value = "";
      loadAttendance();
    })
    .catch((err) => {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance");
    });
}

function loadAttendance() {
  fetch(`${API_BASE}/attendance`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("attendanceTableBody");
      tbody.innerHTML = "";

      if (data.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="5" style="text-align:center">No records found</td></tr>';
        return;
      }

      data.forEach((record) => {
        tbody.innerHTML += `
          <tr>
            <td>${record.history_id}</td>
            <td>${record.student_id}</td>
            <td>${record.date}</td>
            <td>${record.status}</td>
            <td>
              <button onclick="editAttendance(${record.history_id})">Edit</button>
              <button onclick="deleteAttendance(${record.history_id})">Delete</button>
            </td>
          </tr>
        `;
      });
    })
    .catch((err) => {
      console.error("Error loading attendance:", err);
    });
}

function editAttendance(id) {
  const newStatus = prompt("Enter new status (Present/Absent)");
  if (!newStatus || (newStatus !== "Present" && newStatus !== "Absent")) {
    alert("Invalid status. Please enter Present or Absent");
    return;
  }

  fetch(`${API_BASE}/attendance?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attendance_status: newStatus }),
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      loadAttendance();
    })
    .catch((err) => {
      console.error("Error editing attendance:", err);
      alert("Failed to update attendance");
    });
}

function deleteAttendance(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  fetch(`${API_BASE}/attendance?id=${id}`, {
    method: "DELETE",
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      loadAttendance();
    })
    .catch((err) => {
      console.error("Error deleting attendance:", err);
      alert("Failed to delete attendance");
    });
}

function loadStudentAttendance(studentId) {
  fetch(`${API_BASE}/attendance?studentId=${studentId}`)
    .then((res) => res.json())
    .then((records) => {
      const tbody = document.getElementById("studentAttendanceBody");
      tbody.innerHTML = "";

      if (records.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="2" style="text-align:center">No records found</td></tr>';
        return;
      }

      records.forEach((record) => {
        tbody.innerHTML += `
          <tr>
            <td>${record.date}</td>
            <td>${record.status}</td>
          </tr>
        `;
      });
    })
    .catch((err) => {
      console.error("Error loading student attendance:", err);
      alert("Failed to load attendance records");
    });
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
