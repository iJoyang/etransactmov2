function redirectWithDelay(url, delay) {
  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) {
    loadingMessage.style.display = "flex";
  }
  setTimeout(function () {
    window.location.replace(url);
  }, delay);
}

function redirectToUser() {
  console.log("Redirecting to user...");
  redirectWithDelay("client-etransactmo/User-side/user-login.php", 1000); // 1 second delay
}

function redirectToAdmin() {
  console.log("Redirecting to admin...");
  redirectWithDelay("admin-etransactmo/admin/admin_login.php", 1000); // 1 second delay
}
