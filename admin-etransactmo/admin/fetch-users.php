<?php
include('../config.php');
header('Content-Type: application/json');

// Get query parameters
$district = $_GET['district'] ?? '';
$purok = $_GET['purok'] ?? '';

if ($district && $purok) {
    // Run query to find users where address contains both purok and district
    $sql = "SELECT * FROM residents WHERE address LIKE ? AND address LIKE ? ORDER BY id ASC";
    $stmt = $conn->prepare($sql);
    $likePurok = "%$purok%";
    $likeDistrict = "%$district%";
    $stmt->bind_param("ss", $likePurok, $likeDistrict);
} else {
    // Fetch all residents if no filter is provided
    $sql = "SELECT * FROM residents ORDER BY id ASC";
    $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
$stmt->close();
$conn->close();
