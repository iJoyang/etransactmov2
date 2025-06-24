<?php
include('session-validate.php');
// Redirect logged-in users away from the login page
if (isset($_SESSION['id'])) {
  header("Location: user-dashboard.php");
  exit;
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User-Login</title>
  <link rel="stylesheet" href="../CSS/user-login.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <script src="../Javascript/user-login.js" defer></script>
</head>

<body>

  <div class="background">
    <!-- Logo -->
    <div class="logo-container">
      <div class="logo">
        <button class="logo-button" onclick="redirectToHome()">
          <img class="logo_size" src="../Images/logo with name.png" alt="Logo" />
        </button>
      </div>
    </div>

    <div class="login-container">
      <div class="title-text">
        <h1>RESIDENT LOGIN</h1>
      </div>
      <p>Please scan your QR Code to Login</p>
      <!-- Login Button -->
      <button onclick="redirectToScanQR(event)" class="btn login-btn">
        <i class="fas fa-qrcode"></i>
        <span class="text">Scan to Login</span>
      </button>
      <br>
      <!-- Register Button -->
      <!-- <p>No QR Code? <a href="javascript:void(0)" onclick="redirectToGenerateQR(event)">Click Here to Register</a></p> -->
    </div>
  </div>
  <div id="loadingMessage">
    <img id="loadingLogo" src="../Images/logo.png" alt="Loading">
  </div>
</body>