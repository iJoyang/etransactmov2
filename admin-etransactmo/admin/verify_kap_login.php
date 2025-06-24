<?php
header("Content-Type: application/json");

// Hardcoded credentials for Barangay Captain (Kapitan)
$kap_email = "rodolfobeltran@gmail.com";
$kap_password = "r0d0lf0b3ltr4n";

// Get JSON input from the request
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email']);
$password = trim($data['password']);

// Validate login credentials
if ($email === $kap_email && $password === $kap_password) {
    echo json_encode(["success" => true, "dashboard" => "../admin/kap_dashboard.php"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid username or password."]);
}
?>
