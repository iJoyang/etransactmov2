document.addEventListener("DOMContentLoaded", () => {
    const handleAction = (userId, action) => {
        const endpoint = action === "accept"
            ? "/SYSTEMMMMM/admin/purokleader/district1/avocado/accept_resident.php"
            : "/SYSTEMMMMM/admin/purokleader/district1/avocado/decline_resident.php";

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(`Resident has been ${action}ed successfully.`);
                    location.reload();
                } else {
                    alert(`Failed to ${action} the resident. Please try again.`);
                }
            })
            .catch((error) => console.error("Error:", error));
    };

    document.querySelectorAll(".accept-btn").forEach((button) => {
        button.addEventListener("click", () => handleAction(button.dataset.id, "accept"));
    });

    document.querySelectorAll(".decline-btn").forEach((button) => {
        button.addEventListener("click", () => handleAction(button.dataset.id, "decline"));
    });

    function logout() {
        window.location.href = "/SYSTEMMMMM/admin/logout.php";

    }
    

    document.querySelector(".logout-btn").addEventListener("click", logout);
});


document.addEventListener("DOMContentLoaded", () => {
    const changeForm = document.getElementById("change-form");
    const changeFormContainer = document.querySelector(".form-container");
    const changeEmailPasswordForm = document.getElementById("change-email-password-form");

    // Open the Change Email/Password Form
    window.openChangeForm = function () {
        changeForm.style.display = "flex"; // Make it visible
    };

    // Close the Form
    window.closeChangeForm = function () {
        changeForm.style.display = "none";
    };

    // Handle Form Submission
    changeEmailPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newEmail = document.getElementById("new-email").value;
        const newPassword = document.getElementById("new-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const userId = 2; // Hardcoded for now, should be fetched dynamically

        fetch("/SYSTEMMMMM/admin/purokleader/district1/avocado/update-user-details.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                new_email: newEmail,
                new_password: newPassword
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Email and Password changed successfully.");
                    closeChangeForm();
                    location.reload();
                } else {
                    alert("Failed to change details. Please try again.");
                }
            })
            .catch((error) => console.error("Error:", error));
    });

});


