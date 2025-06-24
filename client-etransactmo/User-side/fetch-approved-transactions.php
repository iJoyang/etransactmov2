<?php
include('../../config.php');
session_start(); // Make sure session is started

// Check if full_name is available in session
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

date_default_timezone_set("Asia/Manila");
$today = date("Y-m-d");

// 1. Get all transaction names
$categoryLabels = [];
$sql = "SELECT transaction_name FROM transactions ORDER BY transaction_name ASC";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    $categoryLabels[] = $row['transaction_name'];
}

// 2. Count Approved transactions today for the logged-in user by name
$categoryData = [];
$total = 0;

foreach ($categoryLabels as $name) {
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS count 
        FROM submitted_transactions 
        WHERE transaction_name = ? 
          AND DATE(approved_time) = ?
          AND status = 'Approved'
          AND name = ?
    ");
    $stmt->bind_param("sss", $name, $today, $userName);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $categoryData[] = (int)$count;
    $total += (int)$count;
    $stmt->close();
}

// Return JSON
echo json_encode([
    "labels" => $categoryLabels,
    "data" => $categoryData,
    "total" => $total
]);
exit;
