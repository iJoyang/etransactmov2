<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors (only useful if log file exists)
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log'); // Logs in the same directory

// Include database connection
include('../../config.php');

// Check if 'request_id' exists in the query string
if (!isset($_GET['request_id'])) {
    error_log("Missing request_id in GET request");
    die(json_encode(['error' => 'Request ID is missing.']));
}

// Get the request_id from the query string
$request_id = $_GET['request_id'];
$request_id = (int) $request_id;

error_log("Received request_id: " . $request_id); // Debugging

if (!$request_id) {
    die(json_encode(['error' => 'Request ID is missing.']));
}

// Prepare SQL query
$sql = "
    SELECT 
        st.status, 
        st.transaction_name, 
        t.duration_time
    FROM 
        submitted_transactions st
    INNER JOIN 
        transactions t
    ON 
        st.transaction_name = t.transaction_name
    WHERE 
        st.request_id = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("i", $request_id);
    $stmt->execute();
    $stmt->bind_result($status, $transaction_name, $duration_time);

    if ($stmt->fetch()) {
        $response = [
            'status' => $status,
            'transaction_name' => $transaction_name,
            'duration_time' => $duration_time
        ];
    } else {
        error_log("No matching transaction found for request_id: " . $request_id);
        $response = ['error' => 'Transaction not found.'];
    }

    $stmt->close();
} else {
    error_log("SQL Error: " . $conn->error);
    $response = ['error' => 'Error preparing the SQL query.'];
}

$conn->close();

echo json_encode($response);
