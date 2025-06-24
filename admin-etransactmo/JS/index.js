function redirectWithDelay(url, delay) {
  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) {
    loadingMessage.style.display = "flex";
  }
  setTimeout(function () {
    window.location.replace(url);
  }, delay);
}

function redirectToAdmin() {
  console.log("Redirecting to user...");
  redirectWithDelay("admin/admin_login.php", 1000); // 1-second delay
}
