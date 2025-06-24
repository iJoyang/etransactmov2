<?php
// fetch_data.php

// Include the database connection
header('Content-Type: application/json');
include('../../config.php');

// Start the session to access session variables
session_start();

// Ensure that the user is logged in
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit;
}

// Fetch the user ID from the session
$user_id = $_SESSION['id'];

// Fetch the user's name from the 'residents' table using the user ID
$sql = "SELECT full_name FROM residents WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'SQL error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($user_name);
$stmt->fetch();
$stmt->close();

// Check if the user name was found
if (!$user_name) {
    echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    exit;
}
// Fetch data from the database
$sql = "SELECT * FROM submitted_transactions WHERE name=? ORDER BY time_requested DESC, date_requested DESC ";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user_name);
$stmt->execute();
$result = $stmt->get_result();

$transactions = [];

if ($result->num_rows > 0) {
    // Fetch each row as an associative array
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
}

$stmt->close();
$conn->close();

// Return data as JSON
echo json_encode($transactions);
exit;
