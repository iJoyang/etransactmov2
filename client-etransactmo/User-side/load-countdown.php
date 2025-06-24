<?php
session_start();
$id = intval($_SESSION['id']);

include('../../config.php');

$stmt = $conn->prepare("SELECT countdown_end, initial_countdown_end, progress_percent FROM user_timers WHERE user_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "success" => true,
        "countdownEnd" => $row["countdown_end"],
        "initialCountdownEnd" => $row["initial_countdown_end"],
        "progressPercent" => $row["progress_percent"]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "No countdown found"]);
}
