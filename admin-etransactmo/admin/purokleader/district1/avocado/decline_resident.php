<?php
session_start();
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "birs");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

// Retrieve the POST data
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';

if (empty($user_id)) {
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    exit();
}

// Delete the resident from the database
$stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Resident declined successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to decline resident.']);
}

$stmt->close();
$conn->close();
?>
