<?php
// Database Connection
require('../config.php');
header("Content-Type: application/json");


// SQL Query to fetch transaction requests
$sql = "SELECT request_id, name, transaction_name, transaction_type, transaction_details, time_requested, date_requested, status FROM submitted_transactions WHERE status = Approved ORDER BY request_id DESC";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo json_encode(["error" => "No transactions found."]);
    exit();
}

// Send valid JSON response
echo json_encode($data, JSON_PRETTY_PRINT);
$conn->close();
