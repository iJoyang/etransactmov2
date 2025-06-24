<?php
include('../../config.php'); // This contains your DB connection

// Query to count 'Pending' status in submitted_transactions
$sql = "SELECT COUNT(*) AS total FROM submitted_transactions WHERE status = 'Pending'";
$result = mysqli_query($conn, $sql);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    echo $row['total']; // Output just the number
} else {
    echo "0"; // Fallback if query fails
}
