document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("username").value; // Assuming email input is captured here
    const password = document.getElementById("password").value;

    fetch("../admin/verify_pleader_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                alert("Login successful!");
                window.location.href = data.dashboard; // Redirect to the appropriate dashboard
            } else {
                alert(data.message || "Invalid email or password.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while processing the login.");
        });
});
