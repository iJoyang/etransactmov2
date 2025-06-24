<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
header("Content-Type: application/json");
ob_start(); // Start output buffering

include '../config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input."]);
    exit();
}

$position = $data['position'] ?? null;
$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

if (!$position || !$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}


if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? AND position = ?");
$stmt->bind_param("ss", $username, $position);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    if (password_verify($password, $user['password'])) {
        $_SESSION['admin_id'] = $user['admin_id']; // Store admin_id
        $_SESSION['position'] = $user['position'];
        $_SESSION['username'] = $user['username'];

        if ($position === "purok-leader") {
            $redirect = "pleader_dashboard.php";
        } elseif ($position === "captain") {
            $redirect = "kap_dashboard.php";
        } else {
            $redirect = "admin_dashboard.php";
        }
        echo json_encode(["success" => true, "redirect" => $redirect]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found or role mismatch."]);
}

$stmt->close();
$conn->close();

ob_end_flush(); // Ensure no extra output
