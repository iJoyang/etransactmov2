<?php
header('Content-Type: application/json');

include '../config.php';

// Get district and purok from query parameters
$district = $_GET['district'] ?? '';
$purok = $_GET['purok'] ?? '';

if ($district && $purok) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE district = ? AND purok = ? AND validated = 1");
    $stmt->bind_param("ss", $district, $purok);
    $stmt->execute();
    $result = $stmt->get_result();

    $residents = [];
    while ($row = $result->fetch_assoc()) {
        $residents[] = $row;
    }

    echo json_encode($residents);
} else {
    echo json_encode([]);
}

$conn->close();
