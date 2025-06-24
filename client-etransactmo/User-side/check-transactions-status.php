<?php
include('../../config.php');

$sql = "SELECT MAX(request_id) AS latest_id FROM submitted_transactions WHERE name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user_name); // Use same filtering
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode(['latest_id' => $row['latest_id']]);
