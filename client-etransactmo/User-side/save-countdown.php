<?php
session_start();
include('../../config.php');

$id = intval($_SESSION['id']);
$data = json_decode(file_get_contents("php://input"), true);

$countdownEnd = intval($data['countdownEnd']);
$initialCountdownEnd = intval($data['initialCountdownEnd']);
$progressPercent = intval($data['progressPercent']);

$stmt = $conn->prepare("REPLACE INTO user_timers (user_id, countdown_end, initial_countdown_end, progress_percent) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiii", $id, $countdownEnd, $initialCountdownEnd, $progressPercent);
$success = $stmt->execute();

echo json_encode(["success" => $success]);
