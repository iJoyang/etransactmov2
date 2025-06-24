<?php
require '../../config.php'; // Adjust based on your DB connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $requestId = $data['requestId'] ?? null;  // Expecting single requestId
    $newStatus = $data['status'] ?? null;

    if ($requestId && $newStatus) {
        // Update the status in the database
        $stmt = $conn->prepare("UPDATE submitted_transactions SET status = ? WHERE request_id = ?");
        $stmt->bind_param("si", $newStatus, $requestId);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Status updated"]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid input"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
