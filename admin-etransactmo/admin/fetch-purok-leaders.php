<?php


include('../config.php');
header('Content-Type: application/json');
// Get input data
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];
$new_email = $data['new_email'];
$new_password = password_hash($data['new_password'], PASSWORD_BCRYPT); // Hash the password securely

// Update user details in the database
$query = "UPDATE purokleader SET email = ?, password = ? WHERE user_id = ?";
$stmt = $conn->prepare($query);

if ($stmt === false) {
    die(json_encode(["success" => false, "message" => "Query preparation failed: " . $conn->error]));
}

$stmt->bind_param("ssi", $new_email, $new_password, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Email and password updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating details: " . $stmt->error]);
}

$stmt->close();
$conn->close();
