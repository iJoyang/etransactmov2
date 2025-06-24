<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

error_log("Step1: Script started");


// Check if the file runs at all
if (!file_exists("../../config.php")) {
    die(json_encode(["success" => false, "error" => "Config file missing"]));
}


include('session-validate.php');


// Redirect logged-in users away from the login page
if (isset($_SESSION['id'])) {
    header("Location: user-dashboard.php");
    exit;
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}


// Database Connection
include('../../config.php'); // This should initialize the $conn object for MySQLi
error_log("Step 2: Database connected");


// Encryption constants
define('ENCRYPTION_KEY', 'JoyGwapa123');
define('ENCRYPTION_METHOD', 'AES-256-CBC');

// Function to decrypt the QR code content
function decryptContent($encryptedContent)
{
    error_log("Raw Encrypted Content: " . $encryptedContent);

    $parts = explode(':', $encryptedContent);
    if (count($parts) !== 2) {
        error_log("Decryption Error: Invalid format");
        return false; // Ensure proper error handling
    }

    list($encryptedData, $iv) = $parts;
    $key = hash('sha256', ENCRYPTION_KEY);
    $iv = base64_decode($iv);

    $decrypted = openssl_decrypt($encryptedData, ENCRYPTION_METHOD, $key, 0, $iv);
    error_log("Decrypted Content: " . ($decrypted ?: "FAILED"));

    return $decrypted;
}

$response = ['success' => false, 'message' => 'No QR code data received'];


if (!isset($_POST['encrypted_data'])) {
    echo json_encode(["success" => false, "error" => "No QR data received"]);
    exit;
}

// If the encrypted QR data is sent via POST, process it
if (isset($_POST['encrypted_data'])) {
    $encryptedData = $_POST['encrypted_data'];
    $uniqueId = decryptContent($encryptedData);
    $uniqueId = trim((string)$uniqueId);

    error_log("Decrypted Unique ID: " . $uniqueId); // Check if it's empty or incorrect

    // Check if the unique ID exists in the database (only retrieving the ID)
    if ($uniqueId) {
        $stmt = $conn->prepare("SELECT id FROM residents WHERE id = ?");
        $stmt->bind_param('s', $uniqueId);
        error_log("Executing query for ID: " . $uniqueId);

        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            // If the user is found, set the session and return success
            $_SESSION['id'] = $user['id']; // Set the session variable
            $response = ['success' => true, 'unique_id' => $user['id']];
        } else {
            // If no match is found, return failure
            $response = ['success' => false, 'message' => 'Invalid QR code'];
        }

        $stmt->close();
    } else {
        $response = ['success' => false, 'message' => 'Decryption failed'];
    }
}




// Output the JSON response and stop further script execution
header('Content-Type: application/json');
echo json_encode($response);
exit;

error_log("Script finished");
