<?php
include('../../config.php');
session_start();

$full_name = $_SESSION['full_name'] ?? null;

$sql = "SELECT request_id, name, transaction_name
        FROM submitted_transactions
        WHERE status = 'Approved'
        ORDER BY approved_time ASC LIMIT 10";

$result = mysqli_query($conn, $sql);
$transactions = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        if ($row['name'] !== $full_name) {
            $row['name'] = 'Anonymous Client';
            $row['transaction_name'] = 'Hidden Transaction';
        }
        $transactions[] = $row;
    }
}

// Pad the array to always have 10 items
while (count($transactions) < 10) {
    $transactions[] = [
        'request_id' => '',
        'name' => '',
        'transaction_name' => ''
    ];
}

echo json_encode($transactions);
