<?php
// Include database connection
include('../config.php');

// Set header to return JSON
header('Content-Type: application/json');

try {
    // Query to count transactions by status
    $query = "SELECT 
                status, 
                COUNT(*) as count 
              FROM 
                submitted_transactions 
              GROUP BY 
                status";
    
    // Check connection type and use appropriate fetch method
    if ($conn instanceof PDO) {
        // PDO connection
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        // Initialize result array
        $result = [
            'pending' => 0,
            'approved' => 0,
            'rejected' => 0
        ];
        
        // Fetch results
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $status = strtolower($row['status']);
            
            // Map to our standard status categories
            if ($status == 'pending') {
                $result['pending'] = (int)$row['count'];
            } else if ($status == 'approved') {
                $result['approved'] = (int)$row['count'];
            } else if ($status == 'rejected') {
                $result['rejected'] = (int)$row['count'];
            }
        }
    } else {
        // MySQLi connection
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $stmt->bind_result($status, $count);
        
        // Initialize result array
        $result = [
            'pending' => 0,
            'approved' => 0,
            'rejected' => 0
        ];
        
        // Fetch results
        while ($stmt->fetch()) {
            $status = strtolower($status);
            
            // Map to our standard status categories
            if ($status == 'pending') {
                $result['pending'] = (int)$count;
            } else if ($status == 'approved') {
                $result['approved'] = (int)$count;
            } else if ($status == 'rejected') {
                $result['rejected'] = (int)$count;
            }
        }
    }
    
    // Calculate total
    $total = $result['pending'] + $result['approved'] + $result['rejected'];
    
    // Add percentages if total > 0
    if ($total > 0) {
        $result['pending_percent'] = round(($result['pending'] / $total) * 100, 1);
        $result['approved_percent'] = round(($result['approved'] / $total) * 100, 1);
        $result['rejected_percent'] = round(($result['rejected'] / $total) * 100, 1);
    } else {
        $result['pending_percent'] = 0;
        $result['approved_percent'] = 0;
        $result['rejected_percent'] = 0;
    }
    
    // Add status to result
    $result['status'] = 'success';
    
    // Return JSON response
    echo json_encode($result);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>