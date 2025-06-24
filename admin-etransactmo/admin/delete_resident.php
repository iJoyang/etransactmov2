<?php
// delete_resident.php
header("Content-Type: application/json");

include '../config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if 'id' is set from POST body
    $id = $_POST['id'] ?? null;

    if ($id) {
        $stmt = $conn->prepare("DELETE FROM residents WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Resident deleted successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database execution failed."
            ]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Resident ID not provided."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
}
?>
