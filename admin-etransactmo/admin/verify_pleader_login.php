<?php
session_start();
header("Content-Type: application/json");

// Get input data
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

// Database connection
$conn = new mysqli("localhost", "root", "", "birs");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

// Fetch user data
$stmt = $conn->prepare("SELECT user_id, role, password FROM purokleader WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['email'] = $email;
    $_SESSION['role'] = $user['role'];

    // Set dashboard URL based on role
    $dashboard = '';
    if ($user['role'] === 'Avocado') {
        $dashboard = "../admin/purokleader/district1/avocado/pleader_dashboard.php";
    } elseif ($user['role'] === 'Durian') {
        $dashboard = "../admin/purokleader/district1/durian/durianpleader_dashboard.php";
    }

    echo json_encode(['success' => true, 'dashboard' => $dashboard]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
}

$stmt->close();
$conn->close();
?>
