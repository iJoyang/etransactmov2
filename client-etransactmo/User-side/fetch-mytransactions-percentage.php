<?php
include('../../config.php');
session_start();

if (!isset($_SESSION['full_name'])) {
    echo json_encode([
        "labels" => [],
        "data" => [],
        "total" => 0,
        "error" => "User not logged in"
    ]);
    exit;
}

$userName = $_SESSION['full_name'];

$statuses = ['Pending', 'Approved', 'Finished'];
$counts = [];
$total = 0;

// Fetch count for each status
foreach ($statuses as $status) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM submitted_transactions WHERE name = ? AND status = ?");
    $stmt->bind_param("ss", $userName, $status);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $counts[$status] = $count;
    $total += $count;
    $stmt->close();
}

// Calculate percentages
$percentages = [];
foreach ($statuses as $status) {
    $percent = $total > 0 ? round(($counts[$status] / $total) * 100, 2) : 0;
    $percentages[] = $percent;
}

echo json_encode([
    "labels" => $statuses,
    "data" => $percentages,
    "total" => 100 // Because it's a percentage chart
]);
exit;
