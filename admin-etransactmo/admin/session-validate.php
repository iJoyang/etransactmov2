<?php
// Start the session
session_start();

// Function to validate user session
function validateUserSession($redirectToDashboard = true)
{
    // Check if user session exists
    if (!isset($_SESSION['id'])) {
        // If no session, redirect to login
        header("Location: user-login.php");
        exit;
    }

    // If user is logged in and accessed a page other than the dashboard
    $currentUrl = basename($_SERVER['PHP_SELF']);
    if ($redirectToDashboard && $currentUrl !== "user-dashboard.php") {
        header("Location: user-dashboard.php");
        exit;
    }
}
