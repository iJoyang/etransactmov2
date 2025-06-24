<?php
// Database Connection
include('../config.php');

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the request parameters
    $requestId = isset($_POST['requestId']) ? intval($_POST['requestId']) : 0;
    $status = isset($_POST['status']) ? $_POST['status'] : '';
    
    // Validate the status
    $validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!in_array($status, $validStatuses)) {
        echo json_encode(['success' => false, 'message' => 'Invalid status value']);
        exit;
    }
    
    // Update the transaction status in the database
    $query = "UPDATE submitted_transactions SET status = ? WHERE request_id = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param('si', $status, $requestId);
    $result = $stmt->execute();
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Transaction status updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update transaction status: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
