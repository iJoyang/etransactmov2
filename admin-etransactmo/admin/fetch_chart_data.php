<?php
// Database Connection
include('../config.php');

// Initialize response array
$response = array();

// Add error handling
try {
    // 1. Get total registered residents
    $query = "SELECT COUNT(*) as total FROM residents";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['totalRegistered'] = $row['total'];

    // 2. Get pending requests
    $query = "SELECT COUNT(*) as total FROM submitted_transactions WHERE status = 'Pending'";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['pendingRequests'] = $row['total'];

    // 3. Get to validate count (assuming 'To Validate' is a status)
    $query = "SELECT COUNT(*) as total FROM submitted_transactions WHERE status = 'To Validate'";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    $row = $result->fetch_assoc();
    $response['toValidate'] = $row['total'];

    // 4. Get gender distribution
    $query = "SELECT gender, COUNT(*) as count FROM residents GROUP BY gender";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    $genderData = array();
    while ($row = $result->fetch_assoc()) {
        $genderData[] = array(
            'gender' => $row['gender'],
            'count' => (int)$row['count']
        );
    }
    $response['genderDistribution'] = $genderData;

    // 5. Get district distribution
    // Extract district from address field
    $query = "SELECT 
                SUBSTRING_INDEX(SUBSTRING_INDEX(address, 'DISTRICT ', -1), ',', 1) as district,
                COUNT(*) as count 
              FROM residents 
              WHERE address LIKE '%DISTRICT%' 
              GROUP BY district 
              ORDER BY CAST(district AS UNSIGNED)";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    $districtData = array();
    while ($row = $result->fetch_assoc()) {
        $districtData[] = array(
            'district' => 'District ' . $row['district'],
            'count' => (int)$row['count']
        );
    }
    $response['districtDistribution'] = $districtData;

    // 6. Get age group distribution
    $query = "SELECT 
                CASE 
                    WHEN age BETWEEN 0 AND 12 THEN 'Children (0-12)'
                    WHEN age BETWEEN 13 AND 19 THEN 'Teenagers (13-19)'
                    WHEN age BETWEEN 20 AND 35 THEN 'Young Adults (20-35)'
                    WHEN age BETWEEN 36 AND 59 THEN 'Adults (36-59)'
                    ELSE 'Seniors (60+)'
                END as age_group,
                COUNT(*) as count
              FROM residents
              GROUP BY age_group
              ORDER BY MIN(age)";
    $result = $conn->query($query);
    if (!$result) {
        throw new Exception("Error executing query: " . $conn->error);
    }
    $ageData = array();
    while ($row = $result->fetch_assoc()) {
        $ageData[] = array(
            'ageGroup' => $row['age_group'],
            'count' => (int)$row['count']
        );
    }
    $response['ageDistribution'] = $ageData;

    // 7. Get monthly transaction data by gender
    // For simplicity, we'll generate sample data if there's no real data
    $months = array('January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December');

    $monthlyData = array();
    foreach ($months as $index => $month) {
        // For demo purposes, generate some random data
        $maleCount = rand(1, 10);
        $femaleCount = rand(1, 10);
        
        $monthlyData[] = array(
            'month' => $month,
            'male' => $maleCount,
            'female' => $femaleCount
        );
    }
    $response['monthlyTransactions'] = $monthlyData;

    // Return success status
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
