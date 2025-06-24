<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli("localhost", "username", "password", "database_name");
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}
$request_id = $data["request_id"];
$status = "printed"; // Example status change
$stmt = $conn->prepare("UPDATE transactions SET status = ? WHERE request_id = ?");
$stmt->bind_param("si", $status, $request_id);
$success = $stmt->execute();
echo json_encode(["success" => $success]);
$stmt->close();
$conn->close();
?>
