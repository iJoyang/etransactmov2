// Redirection with delay
function redirectWithDelay(url, delay) {
  document.getElementById("loadingMessage").style.display = "flex";
  setTimeout(() => window.location.replace(url), delay);
}

// Redirect to home page
function redirectToHome() {
  redirectWithDelay("../../../index.php", 1000);
}

function redirectToScanQR() {
  redirectWithDelay("../User-side/user-scanqr.php", 1000);
}

function redirectToGenerateQR() {
  redirectWithDelay("../User-side/user-register.php", 1000);
}
