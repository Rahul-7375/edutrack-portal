const user = JSON.parse(localStorage.getItem("user"));

if (!user) window.location.href = "login.html";

document.getElementById("welcome").innerText =
  "Welcome " + user.full_name + " (" + user.role + ")";

if (user.role === "faculty") {
  document.getElementById("facultyPanel").style.display = "block";
  loadAttendance();
  fetchStudents();
} else if (user.role === "student") {
  document.getElementById("studentPanel").style.display = "block";
  loadStudentAttendance(user.account_id);
}

function fetchStudents() {
  fetch("/students")
    .then((res) => res.json())
    .then((students) => {
      const select = document.getElementById("studentId");
      students.forEach((student) => {
        const option = document.createElement("option");
        option.value = student.account_id;
        option.innerText =
          student.full_name + " (ID: " + student.account_id + ")";
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("Error fetching students:", err));
}

function markAttendance() {
  fetch("/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId.value,
      faculty_id: user.account_id,
      attendance_date: date.value,
      attendance_status: status.value,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Attendance Added");
      loadAttendance();
    });
}

function loadAttendance() {
  fetch("/attendance")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("attendanceTableBody");
      tbody.innerHTML = "";

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
    });
}

function editAttendance(id) {
  const newStatus = prompt("Enter new status (Present/Absent)");

  if (!newStatus) return;

  fetch(`/attendance/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attendance_status: newStatus }),
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      loadAttendance();
    });
}

function deleteAttendance(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`/attendance/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.text())
    .then((msg) => {
      alert(msg);
      loadAttendance();
    });
}

function loadStudentAttendance(studentId) {
  fetch(`/attendance/${studentId}`)
    .then((res) => res.json())
    .then((records) => {
      const tbody = document.getElementById("studentAttendanceBody");
      tbody.innerHTML = "";

      if (records.length === 0) {
        tbody.innerHTML =
          "<tr><td colspan='2' style='text-align:center'>No records found</td></tr>";
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
    .catch((err) => console.error("Error loading student attendance:", err));
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
