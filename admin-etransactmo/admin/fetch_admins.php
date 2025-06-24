<?php
include '../config.php';

$sql = "SELECT * FROM admin";
$result = $conn->query($sql);

$admins = [];
while ($row = $result->fetch_assoc()) {
  $admins[] = $row;
}

header('Content-Type: application/json');
echo json_encode($admins);
?>
