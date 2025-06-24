<?php
include '../config.php';

// Fetch pending transactions with requestor name
$query = "SELECT *
          FROM submitted_transactions 
          WHERE status = 'Pending'";

$result = $conn->query($query);

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

// Return data as JSON
echo json_encode($requests);

$conn->close();
