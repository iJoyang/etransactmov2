<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

session_start();
include('../../config.php');

$id = intval($_SESSION['id']);
$sql = "SELECT full_name FROM residents WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($full_name);
$stmt->fetch();
$stmt->close();

$transactionSql = "SELECT request_id, name, transaction_name, transaction_type, transaction_details, time_requested, date_requested, status FROM `submitted_transactions` WHERE name = ? ORDER BY date_requested DESC, time_requested DESC LIMIT 1";
$transactionStmt = $conn->prepare($transactionSql);
$transactionStmt->bind_param("s", $full_name);
$transactionStmt->execute();
$transactionStmt->bind_result($request_id, $name, $transaction_name, $transaction_type, $transaction_details, $time_requested, $date_requested, $status);
$transactionStmt->fetch();
$transactionStmt->close();

header('Content-Type: application/json');

if ($status) {
    echo json_encode([
        'status' => $status,
        'time_requested' => $time_requested,
        'date_requested' => $date_requested
    ]);
} else {
    echo json_encode(['status' => 'Pending']);
}
exit();
