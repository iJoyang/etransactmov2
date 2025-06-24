<?php
$conn = new mysqli("localhost", "root", "", "birs");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare("
    SELECT user_id, first_name, last_name, email, contact_number
    FROM users
    WHERE district = 'District 1' AND purok = 'Purok Durian' 
    AND (validated IS NULL OR validated = 0)
");

if ($stmt) {
    $stmt->execute();
    $result = $stmt->get_result();
    $residents = [];
    while ($row = $result->fetch_assoc()) {
        $residents[] = $row;
    }
    $stmt->close();
} else {
    $residents = [];
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purok Leader Dashboard</title>
    <link rel="stylesheet" href="/SYSTEMMMMM/admin/purokleader/district1/durian/durianpleader_dashboard.css">
    <script src="/SYSTEMMMMM/admin/purokleader/district1/durian/durianpleader_dashboard.js" defer></script>
</head>
<body>
    <div class="dashboard-container">
        <h1>Welcome, Udelisa Casayas!</h1>
        <h2>Members of District 1, Purok Durian</h2>
        
        <div class="table-container">
            <table id="residents-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($residents)): ?>
                        <?php foreach ($residents as $resident): ?>
                            <tr>
                                <td><?= htmlspecialchars($resident['user_id']) ?></td>
                                <td><?= htmlspecialchars($resident['first_name']) ?></td>
                                <td><?= htmlspecialchars($resident['last_name']) ?></td>
                                <td><?= htmlspecialchars($resident['email']) ?></td>
                                <td><?= htmlspecialchars($resident['contact_number']) ?></td>
                                <td>
                                    <button class="accept-btn" data-id="<?= $resident['user_id'] ?>">Accept</button>
                                    <button class="decline-btn" data-id="<?= $resident['user_id'] ?>">Decline</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6">No residents found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
            
            <div class="button-container">
    <a href="http://localhost/SYSTEMMMMM/admin/purokleader/district1/durian/viewresidents/view_residents.php" class="text-btn">View Residents</a>
    <button class="text-btn" onclick="openChangeForm()">Change Email/Password</button>
</div>

<!-- Popup Form for Changing Email & Password -->
<div id="change-form" class="popup-form" style="display: none;">
    <div class="form-container">
        <h2>Change Email and Password</h2>
        <form id="change-email-password-form">
            <label for="new-email">New Email:</label>
            <input type="email" id="new-email" required>

            <label for="new-password">New Password:</label>
            <input type="password" id="new-password" required>

            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" required>

            <button type="submit">Done</button>
            <button type="button" onclick="closeChangeForm()">Cancel</button>
        </form>
    </div>
</div>

<!-- Logout button positioned separately at the bottom-right -->
<button class="logout-btn" id="logoutBtn">Logout</button>