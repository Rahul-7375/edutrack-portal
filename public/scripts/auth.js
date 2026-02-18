const API_BASE = "/api";

const getVal = (id) => document.getElementById(id).value;

function register() {
  const data = {
    full_name: getVal("name"),
    email: getVal("regEmail"),
    password: getVal("regPass"),
    role: getVal("role"),
  };

  if (!data.full_name || !data.email || !data.password) {
    alert("Please fill in all fields");
    return;
  }

  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const msg = await res.text();
      if (res.ok) {
        alert(msg);
        toggleRegister(false);
      } else {
        alert("Error: " + msg);
      }
    })
    .catch((err) => alert("Request failed: " + err));
}

function login() {
  const email = getVal("email");
  const password = getVal("password");

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      if (res.ok) return res.json();
      const text = await res.text();
      throw new Error(text);
    })
    .then((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "dashboard.html";
    })
    .catch((err) => alert(err.message));
}
