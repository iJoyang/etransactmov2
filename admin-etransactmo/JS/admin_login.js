// Redirect to admin login page
function redirectToAdminRegister() {
  redirectWithDelay("../admin/admin_register.php", 1000);
}

//Redirect to index page
// Redirect to home page
function redirectToHome() {
  redirectWithDelay("../../../index.php", 1000);
}

// Redirection with delay
function redirectWithDelay(url, delay) {
  document.getElementById("loadingMessage").style.display = "flex";
  setTimeout(() => window.location.replace(url), delay);
}

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const position = document.getElementById("position").value; // Get selected role
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!position || !username || !password) {
      alert("Please select a role and enter both username and password.");
      return;
    }

    fetch("../admin/verify_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position, username, password }),
    })
      .then((response) => response.text()) // Get raw text first
      .then((text) => {
        console.log("Raw Response:", text); // Log the full response for debugging

        try {
          const data = JSON.parse(text); // Try to parse JSON
          if (data.success) {
            redirectWithDelay((window.location.href = data.redirect), 3000); // Redirect based on role
          } else {
            alert(data.message || "Invalid credentials.");
            document.getElementById("password").value = ""; // Clear password field
          }
        } catch (e) {
          console.error("JSON Parse Error:", e);
          alert("Unexpected response format. Check console.");
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        alert("An error occurred while processing the login.");
      });
  });
