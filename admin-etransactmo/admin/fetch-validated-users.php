<?php
header('Content-Type: application/json');
require 'database_connection.php'; // REMOVE IF NOT USED

if (isset($_GET['request_id'])) {
    $request_id = intval($_GET['request_id']);
    $query = "SELECT * FROM barangay_clearance_requests WHERE request_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $request_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(null);
    }
} else {
    echo json_encode(null);
}
?>
