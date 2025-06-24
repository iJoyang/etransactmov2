<?php
include '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$name = $data['name'];
$username = $data['username'];
$password = $data['password'];
$mobile = $data['mobile_number'];
$position = $data['position'];
$district = $data['district'];
$purok = $data['purok'];

$stmt = $conn->prepare("UPDATE admin SET name=?, username=?, password=?, mobile_number=?, position=?, district=?, purok=? WHERE admin_id=?");
$stmt->bind_param("sssssssi", $name, $username, $password, $mobile, $position, $district, $purok, $id);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Admin updated successfully."]);
