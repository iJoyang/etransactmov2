<?php
include '../config.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['request_id']) || !isset($data['status'])) {
    echo json_encode(["success" => false, "message" => "Invalid request data."]);
    exit;
}

$request_id = intval($data['request_id']);
$status = ucfirst(strtolower($data['status']));

// Allowed statuses
$valid_statuses = ['Pending', 'Approved', 'Rejected', 'Finished'];
if (!in_array($status, $valid_statuses)) {
    echo json_encode(["success" => false, "message" => "Invalid status value."]);
    exit;
}

// Build update query with dynamic time fields
$time_fields = "";
if ($status === 'Approved') {
    $time_fields = ", approved_time = NOW()";
} elseif ($status === 'Finished') {
    $time_fields = ", finished_time = NOW()";
}

$query = "UPDATE submitted_transactions 
          SET status = ?" . $time_fields . " 
          WHERE request_id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Query preparation failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("si", $status, $request_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Request updated to '$status'."]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
