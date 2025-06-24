<?php
// Include database connection
include('../config.php');

// Get the username from the AJAX request
$username = isset($_POST['username']) ? trim($_POST['username']) : '';

// Query to check if the username exists
$sql = "SELECT * FROM admin WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Check if username exists
if ($result->num_rows > 0) {
    echo "taken"; // Username is already in use
} else {
    echo "available"; // Username is available
}

$stmt->close();
$conn->close();
