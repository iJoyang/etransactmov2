<?php
// Database Connection
include('../config.php');

// Initialize response array
$response = array();

try {
    // Get all transactions
    $query = "SELECT * FROM submitted_transactions ORDER BY date_requested DESC, time_requested DESC";
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    
    $transactions = array();
    while ($row = $result->fetch_assoc()) {
        $transactions[] = array(
            'request_id' => $row['request_id'],
            'name' => $row['name'],
            'transaction_name' => $row['transaction_name'],
            'transaction_type' => $row['transaction_type'],
            'transaction_details' => $row['transaction_details'],
            'time_requested' => $row['time_requested'],
            'date_requested' => $row['date_requested'],
            'status' => $row['status']
        );
    }
    
    $response['transactions'] = $transactions;
    $response['status'] = 'success';
    
} catch (Exception $e) {
    // Return error status and message
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);

// Close connection
$conn->close();
?>
