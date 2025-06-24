<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$entered_otp = $data['otp'] ?? '';

if (!empty($_SESSION['otp']) && $_SESSION['otp'] == $entered_otp) {
    $_SESSION['logged_in'] = true;
    unset($_SESSION['otp']);
    echo json_encode(['success' => true, 'message' => 'Login successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid OTP']);
}
