<?php
include('client-etransactmo/User-side/session-validate.php');
// Redirect logged-in users away from the login page
if (isset($_SESSION['id'])) {
    header("Location: client-etransactmo/User-side/user-dashboard.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eTransactMo</title>
    <link rel="stylesheet" href="index.css">
    <script src="index.js" defer> </script>
</head>


<body>

    <div class="background">
        <div class="logo">
            <img class="logo-img" src="client-etransactmo\Images\logo with name.png" alt="etransactmo logo">
        </div>
        <div class="buttons">
            <button onclick="redirectToUser()" class="user-button">
                <span>Login as Client</span>
            </button>
            <br>
            <button onclick="redirectToAdmin()" class="admin-button">
                <span>Login as Admin</span>
            </button>
        </div>
        <div id="loadingMessage">
            <img id="loadingLogo" src="client-etransactmo/Images/logo.png" alt="Loading">
        </div>
    </div>
</body>

</html>