const getVal = (id) => document.getElementById(id).value;

function showRegister() {
  const loginBox = document.getElementById("loginBox");
  const registerBox = document.getElementById("registerBox");
  if (loginBox) loginBox.style.display = "none";
  if (registerBox) registerBox.style.display = "block";
}

function register() {
  const data = {
    full_name: getVal("name"),
    email: getVal("regEmail"),
    password: getVal("regPass"),
    role: getVal("role"),
  };

  fetch("/register", {
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
  fetch("/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: getVal("email"),
      password: getVal("password"),
    }),
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
