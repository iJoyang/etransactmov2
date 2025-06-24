<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validated Residents</title>
    <link rel="stylesheet" href="view_resident.css"> <!-- Ensure correct path to CSS -->
</head>

<body>

    <div class="main-content">
        <h1>View Validated Residents</h1>
        <div class="filter-container">
            <label for="district-dropdown">District:</label>
            <select id="district-dropdown">
                <option value="">-- Select District --</option>
            </select>

            <label for="purok-dropdown">Purok:</label>
            <select id="purok-dropdown" disabled>
                <option value="">-- Select Purok --</option>
            </select>
        </div>

        <div class="table-container">
            <table id="validated-residents-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td colspan="5">Please select a district and purok to view data.</td></tr>
                </tbody>
            </table>
        </div>
        <!-- Back Button -->
<div class="button-container">
<a href="http://localhost/SYSTEMMMMM/admin/purokleader/district1/avocado/pleader_dashboard.php" class="back-button">Back</a>
</div>

    <script src="view_residents.js"></script> <!-- Ensure correct path to JS -->
</body>
</html>
