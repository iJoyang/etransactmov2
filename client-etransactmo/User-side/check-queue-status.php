<?php
include('../../config.php');

$sql = "SELECT 
            (SELECT MAX(approved_time) FROM submitted_transactions WHERE status = 'Approved') AS latest_processing,
            (SELECT MAX(finished_time) FROM submitted_transactions WHERE status = 'Finished') AS latest_finished";

$result = mysqli_query($conn, $sql);
$data = mysqli_fetch_assoc($result);

echo json_encode([
    'latest_processing' => $data['latest_processing'] ?? null,
    'latest_finished' => $data['latest_finished'] ?? null
]);
