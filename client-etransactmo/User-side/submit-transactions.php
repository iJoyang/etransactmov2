<?php
// submit-transactions.php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);


// Include the database connection
include('../../config.php');

// Start the session to access session variables
session_start();

// Ensure that the user is logged in
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit;
}

// Fetch the user ID from the session
$user_id = $_SESSION['id'];

// Fetch the user's name from the 'residents' table using the user ID
$sql = "SELECT full_name FROM residents WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($user_name);
$stmt->fetch();
$stmt->close();

// Check if the user name was found
if (!$user_name) {
    echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    exit;
}

// Debugging: Output received JSON data
$raw_data = file_get_contents('php://input');
error_log("Received JSON: " . $raw_data);

// Get the JSON-encoded data from the request
$data = json_decode($raw_data, true);
if ($data === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON format.', 'raw_data' => $raw_data]);
    exit;
}



if (!isset($data['transactions']) || !is_array($data['transactions'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data.']);
    exit;
}


$transactions = $data['transactions'];

// Prepare the SQL statement for inserting into submitted_transactions
foreach ($transactions as $transaction_id) {
    // Fetch transaction details based on the transaction ID
    $sql = "SELECT transaction_name, transaction_type, transaction_details, NOW() AS time_requested, NOW() AS date_requested FROM transactions WHERE transaction_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $transaction_id);
    $stmt->execute();
    $stmt->bind_result($transaction_name, $transaction_type, $transaction_details, $time_requested, $date_requested);
    $stmt->fetch();
    $stmt->close();

    if ($transaction_name) {
        $insert_sql = "INSERT INTO submitted_transactions (name, transaction_name, transaction_type, transaction_details, time_requested, date_requested, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)";
        $insert_stmt = $conn->prepare($insert_sql);
        $status = "Pending"; // Default value for status
        $insert_stmt->bind_param("sssssss", $user_name, $transaction_name, $transaction_type, $transaction_details, $time_requested, $date_requested, $status);
        $insert_stmt->execute();
        $insert_stmt->close();
    }
}

// Fetch all request IDs from submitted_transactions
$request_ids = [];
$fetch_sql = "SELECT request_id FROM submitted_transactions ORDER BY request_id ASC";
$result = $conn->query($fetch_sql);
while ($row = $result->fetch_assoc()) {
    $request_ids[] = $row["request_id"];
}
// Send final JSON response
echo json_encode(['status' => 'success', 'message' => 'Transactions submitted successfully!', 'request_id' => $request_ids]);



$conn->close();
