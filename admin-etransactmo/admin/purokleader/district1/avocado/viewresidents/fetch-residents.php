<?php
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "birs");

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

// Get district and purok from query parameters
$district = $_GET['district'] ?? '';
$purok = $_GET['purok'] ?? '';

if ($district && $purok) {
    $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email, contact_number FROM users WHERE district = ? AND purok = ? AND validated = 1");
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
?>
