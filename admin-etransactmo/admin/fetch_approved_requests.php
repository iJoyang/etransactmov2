<?php
include '../config.php'; // or wherever your DB connection is

header('Content-Type: application/json');

$sql = "SELECT * FROM submitted_transactions WHERE status = 'Approved'";
$result = $conn->query($sql);

$data = [];

if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

echo json_encode($data);
?>
