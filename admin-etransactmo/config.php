<?php
// // Database configuration
// $host = 'auth-db1859.hstgr.io';
// $username = 'u490619017_etransactmo';
// $password = 'Etransactmo@2025';
// $dbname = 'u490619017_etransactmo';


$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'etransactmo';


$conn = new mysqli($host, $username, $password, $dbname);

// Check connection without generating output
if ($conn->connect_error) {
    // Optionally, log the error for debugging purposes (example: write to a log file)
    error_log("Connection failed: " . $conn->connect_error);
    $conn = null; // Set $conn to null if the connection fails
}
