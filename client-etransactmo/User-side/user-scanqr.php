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
    <title>QR-Scanner</title>
    <link rel="stylesheet" href="../CSS/user-scanqr.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- <script type="text/javascript" src="../Javascript/instascan.min.js"></script> -->
    <!-- <script type="text/javascript" src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js"></script> -->
    <!-- <script src="https://cdn.jsdelivr.net/gh/schmich/instascan-builds/instascan.min.js"></script> -->
    <script src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js"></script>
    <script src="../Javascript/user-scanner.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>


</head>

<body>
    <div class="logo-container">
        <div class="logo">
            <button class="logo-button" onclick="redirectToHome()">
                <img class="logo-size" src="../Images/logo.png" alt="Logo" />
            </button>
        </div>
        <div class="title-text">
            <h2>ETRANSACTMO SCAN-TO-LOGIN</h2>
        </div>
    </div>

    <div class="scanner-container">
        <video id="preview"></video>
        <button id="switchCamBtn"> <i class="fas fa-camera-rotate"></i></button>

        <div class="overlay-box">
            <div class="corner tl"></div> <!-- Top-left corner -->
            <div class="corner tr"></div> <!-- Top-right corner -->
            <div class="corner bl"></div> <!-- Bottom-left corner -->
            <div class="corner br"></div> <!-- Bottom-right corner -->
            <div class="scanner-line"></div>
            <span class="instruction">Place your QR code inside the box</span>
        </div>

    </div>

    <br>


    <div class="below-scan-container">
        <label for="qrUpload" class="custom-file-upload">
            <i class="fas fa-upload"></i> Upload QR Code Image
        </label>
        <input type="file" id="qrUpload" accept="image/*" hidden>
        <span id="fileName">No file chosen</span>
        <!-- <p>No QR Code? <a href="javascript:void(0)" onclick="redirectToGenerateQR()">Click Here to Register</a></p> -->
    </div>


    <div id="loadingMessage">
        <img id="loadingLogo" src="../Images/logo.png" alt="Loading">
    </div>

</body>

</html>