<?php

session_start();
include('../../config.php');


$full_name = $_SESSION['full_name'] ?? null; // <-- Add this line
echo json_encode($full_name);

$sql = "SELECT request_id, name, transaction_name, 
               TIMESTAMPDIFF(MINUTE, approved_time, finished_time) AS elapsed_time
        FROM submitted_transactions 
        WHERE status = 'Finished'
        ORDER BY finished_time DESC
        LIMIT 5";


$result = mysqli_query($conn, $sql);

$transactions = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // Mask name unless it matches logged-in user
        if ($row['name'] !== $full_name) {
            $row['name'] = 'Anonymous Client';
        }
        $transactions[] = $row;
    }
}

echo json_encode($transactions); // return as JSON
