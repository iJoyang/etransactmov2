<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Include session validation file
include('session-validate.php');

// Validate session and redirect if necessary
validateUserSession();
// Include the database connection
include('../../config.php');




// Fetch user data based on session ID
$id = intval($_SESSION['id']); // Ensure session ID is an integer
$sql = "SELECT full_name, age, gender, contact_number, address, qr_code FROM residents WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($full_name, $age, $gender, $contact_number, $address, $qr_code);
$stmt->fetch();
$stmt->close();

$_SESSION['full_name'] = $full_name; // Store full name for later access


// Fetch transaction history for the logged-in user based on their name
$transactionSql = "SELECT request_id, name, transaction_name, transaction_type, transaction_details, time_requested, date_requested, status FROM `submitted_transactions` WHERE name = ?";
$transactionStmt = $conn->prepare($transactionSql);
$transactionStmt->bind_param("s", $full_name); // Fetch transactions where name matches the logged-in user
$transactionStmt->execute();
$transactionStmt->bind_result($request_id, $name, $transaction_name, $transaction_type, $transaction_details, $time_requested, $date_requested, $status);

// Store transactions in an array
$transactions = [];
while ($transactionStmt->fetch()) {
    $transactions[] = [
        'request_id' => $request_id,
        'name' => $name,
        'transaction_name' => $transaction_name,
        'transaction_type' => $transaction_type,
        'transaction_details' => $transaction_details,
        'time_requested' => $time_requested,
        'date_requested' => $date_requested,
        'status' => $status
    ];
}
$transactionStmt->close();

$latestTransaction = null;
foreach ($transactions as $transaction) {
    if ($transaction['status'] === 'approved') {
        $latestTransaction = $transaction;
        break;
    }
}

$salutation = " "; // Initialize salutation variable

switch ($gender) {
    case "Male":
        $salutation = "MR.";
        break;
    case "Female":
        $salutation = "MS.";
        break;
    case "Prefer not to say":
        $salutation = ""; // No salutation
        break;
    default:
        $salutation = ""; // Optional default case
}
// Prevent caching
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1
header("Pragma: no-cache"); // HTTP 1.0
header("Expires: 0"); // Proxies

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome User</title>
    <link rel="stylesheet" href="../CSS/user-dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="../Javascript/user-dashboard.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script>
        const userId = <?php echo intval($_SESSION['id']); ?>;
    </script>
    <script
        src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>

<body>
    <div class="logo-container">
        <div class="logo">
            <button class="logo-button" onclick="redirectToHome()">
                <img class="logo-size" src="../Images/logo with name.png" alt="Logo" />
            </button>
        </div>
        <div class="title-text">
            <p>Barangay Zone III, Digos City, Davao del Sur</p>
            <h2>Good Day, <?php echo $salutation . " " . $full_name; ?></h2>
        </div>
    </div>

    <div class="dashboard-content-container">
        <div id="user-details" class="dash-content-container active">
            <div class="dashboard-content">
                <h3>User Details</h3>
                <p><strong>NAME: </strong><?php echo isset($full_name) ? htmlspecialchars($full_name) : "Guest"; ?></p>
                <p><strong>AGE: </strong><?php echo isset($age) ? htmlspecialchars($age) : "Guest"; ?></p>
                <p><strong>GENDER: </strong><?php echo isset($gender) ? htmlspecialchars($gender) : "Guest"; ?></p>
                <p><strong>CONTACT NUMBER: </strong><?php echo isset($contact_number) ? htmlspecialchars($contact_number) : "Guest"; ?></p>
                <p><strong>ADDRESS: </strong><?php echo isset($address) ? htmlspecialchars($address) : "Guest"; ?></p>
                <div class="user-detail-buttons">
                    <button type="button" class="btn" onclick="showModal()">
                        <i class="fas fa-qrcode"></i>
                        View QR ID
                    </button>
                    <button type="button" class="btn" onclick="setActive(this, 'select-transaction')"> <i class="fas fa-exchange-alt"></i> Go to Select Transaction</button>
                </div>
            </div>
        </div>

        <div id="select-transaction" class="dash-content-container select-transaction">
            <h3 class="instructions">Please Select any Transaction/s below and click Submit Transaction Request Button.</h3>
            <div class="select-transaction-content card-container">

                <?php
                // Fetch transactions from the database
                $sql = "SELECT transaction_id, transaction_name, transaction_details, requirements, duration_time FROM transactions";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $stmt->bind_result($transaction_id, $transaction_name, $transaction_details, $requirements, $duration_time);


                // Generate dynamic cards
                while ($stmt->fetch()) {
                ?>
                    <?php
                    $details_parts = explode('||', $transaction_details);
                    $english_detail = trim($details_parts[0]);
                    $bisaya_detail = isset($details_parts[1]) ? trim($details_parts[1]) : '';
                    $requirement_items = array_filter(array_map('trim', explode('|', $requirements)));
                    ?>
                    <div class="card" data-id="<?php echo $transaction_id; ?>" data-duration="<?php echo $duration_time; ?>" data-request-id="<?php echo $request_id; ?>">
                        <div class="checkmark">✔</div>
                        <div class="card-inner">
                            <div class="card-front">
                                <h3><?php echo htmlspecialchars($transaction_name); ?></h3>
                            </div>
                            <div class="card-back">
                                <h3><?php echo htmlspecialchars($transaction_name); ?></h3>
                                <div class="card-details">
                                    <div class="scroll-content">
                                        <div class="info-row">
                                            <h4>Details:</h4>
                                            <p><?php echo htmlspecialchars($english_detail); ?></p>
                                        </div>
                                        <div class="info-row">
                                            <h4>Requirements:</h4>
                                            <ul>
                                                <?php foreach ($requirement_items as $item): ?>
                                                    <li><?php echo htmlspecialchars($item); ?></li>
                                                <?php endforeach; ?>
                                            </ul>
                                        </div>

                                        <div class="info-row">
                                            <h4>Estimated Processing Time:</h4>
                                            <p>
                                                <?php
                                                $minutes = round($duration_time / 60);
                                                echo htmlspecialchars($minutes . ' minute' . ($minutes > 1 ? 's' : ''));
                                                ?>
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                <?php
                }
                $stmt->close();
                ?>
                <div class="submit-section">
                    <p id="selected-count">Selected Transactions: 0</p>
                    <button id="submit-button" class="btn" disabled>Submit Transaction Request</button>
                </div>
            </div>
        </div>

        <div id="transaction-history" class="dash-content-container">
            <div class="history-content">
                <div class="chartcontainer">
                    <div class="h-column3 chartbox"> <!-- My Transaction Request-->
                        <h3>My Transaction Requests</h3>
                        <canvas id="myDoughnutChart3"></canvas>
                        <div id="legend-container3" class="custom-legend">
                            <div id="legend-col1-3" class="legend-row"></div>
                            <div id="legend-col2-3" class="legend-column"></div>
                        </div>
                    </div>
                    <div class="h-column1">
                        <div class="chart-content chartbox">
                            <h3>My Pending Requests</h3>
                            <div class="chart1">
                                <canvas id="myDoughnutChart1"></canvas>
                                <div id="legend-container1" class="custom-legend">
                                    <div id="legend-col1-1" class="legend-column"></div>
                                    <div id="legend-col2-1" class="legend-column"></div>
                                </div>
                            </div>
                        </div>
                        <div class="chart-content chartbox"> <!-- Display My Pending Transactions Chart -->
                            <h3>My Approved Requests</h3>
                            <div class="chart1">
                                <canvas id="myDoughnutChart2"></canvas>
                                <div id="legend-container2" class="custom-legend">
                                    <div id="legend-col1-2" class="legend-column"></div>
                                    <div id="legend-col2-2" class="legend-column"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                <div class="h-column2">

                    <!-- Display Transaction Table -->
                    <div class="transaction-table-wrapper">
                        <div class="table-title">
                            <h2 class="t-title">TRANSACTION HISTORY</h2>
                            <input type="text" id="transactionSearch" placeholder="Search transactions...    🔍︎" onkeyup="filterTable()">
                        </div>
                        <table class="transaction-history-table" border="1">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Name of Client</th>
                                    <th>Transaction Name</th>
                                    <th>Transaction Type</th>
                                    <th>Details</th>
                                    <th>Time & Date Requested</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="table-body-scroll">
                            <table class="transaction-history-table" border="1">
                                <tbody id="transaction-table-body">
                                    <!-- The rows will be inserted dynamically by JavaScript -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="waiting-page" class="dash-content-container">
            <div class="waiting-info">
                <div class="column1">
                    <div class="queue-card">
                        <?php
                        // Count total number of approved clients
                        $countSql = "SELECT COUNT(*) AS total_clients FROM submitted_transactions WHERE status = 'Approved'";
                        $countResult = $conn->query($countSql);
                        $totalClients = 0;

                        if ($countResult && $row = $countResult->fetch_assoc()) {
                            $totalClients = $row['total_clients'];
                        }
                        ?>
                        <h1>Now Serving <?= $totalClients ?> Client<?= $totalClients != 1 ? 's' : '' ?></h1>

                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Transaction ID</th>
                                    <th>Client Name</th>
                                    <th>Transaction</th>
                                </tr>
                            </thead>
                            <tbody id="queue-body">
                                <?php
                                // Assuming you have a SQL query for fetching queued transactions
                                $sql = "SELECT request_id, name, transaction_name
                        FROM submitted_transactions
                        WHERE status = 'Approved'
                        ORDER BY approved_time DESC
                        LIMIT 5";

                                $result = $conn->query($sql);

                                if ($result->num_rows > 0) {
                                    $counter = 1; // Variable to count the rows
                                    while ($row = $result->fetch_assoc()) {
                                        // Compare the submitted transaction name with the logged-in user's full name
                                        $display_name = (!empty($row['name']) && !empty($full_name) && strtolower($row['name']) === strtolower($full_name))
                                            ? $row['name']
                                            : 'Anonymous Client';

                                        // Apply special class to the first row
                                        $rowClass = $counter === 1 ? 'serving-now' : '';

                                        echo "<tr class='$rowClass'>";
                                        echo "<td><span class='user-icon'><i class='fas fa-user'></i> " . htmlspecialchars($counter++) . "</span></td>";
                                        // Incrementing row number
                                        echo "<td>" . htmlspecialchars($row['request_id'] ?? '') . "</td>";
                                        echo "<td>" . htmlspecialchars($display_name ?? '') . "</td>";
                                        echo "<td>" . htmlspecialchars($row['transaction_name'] ?? '') . "</td>";
                                        echo "</tr>";
                                    }
                                } else {
                                    echo "<tr><td colspan='4'>No queued transactions found.</td></tr>";
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="column1">
                    <div class="pending-transactions-card">
                        <dotlottie-player
                            src="https://lottie.host/ba6b4c52-628b-4cbf-a3de-1cf044d78a57/zzLjnqX6uu.lottie"
                            background="transparent"
                            speed="1"
                            style="width: 30%; height: auto"
                            loop
                            autoplay></dotlottie-player>
                        <div>
                            <h4><strong>TOTAL OF PENDING TRANSACTIONS IN THIS OFFICE</strong></h4>
                            <p id="pending-count">Loading...</p>
                        </div>
                    </div>

                    <div class="finished-transactions-card">
                        <dotlottie-player
                            src="https://lottie.host/8092eff6-68c8-4f2d-b856-0987d5eba24f/w4TgcSiVLY.lottie"
                            background="transparent"
                            speed="1"
                            style="width: 30%; height: auto"
                            loop
                            autoplay></dotlottie-player>
                        <div>
                            <?php
                            // Get total number of finished transactions
                            $finishedCountSql = "SELECT COUNT(*) AS total_finished FROM submitted_transactions WHERE status = 'Finished'";
                            $finishedCountResult = $conn->query($finishedCountSql);
                            $totalFinished = 0;

                            if ($finishedCountResult && $row = $finishedCountResult->fetch_assoc()) {
                                $totalFinished = $row['total_finished'];
                            }
                            ?>

                            <h3><strong>TOTAL OF COMPLETED TRANSACTIONS:</strong></h3>
                            <p class="completed-count"> <?= $totalFinished ?></p>
                        </div>

                        <!-- <h4>FINISHED TRANSACTIONS</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Client Name</th>
                                    <th>Transaction Name</th>
                                    <th>Process Time</th>
                                </tr>
                            </thead>
                            <tbody id="finished-transactions-body">
                                <?php
                                $sql = "SELECT request_id, name, transaction_name, 
                    TIMESTAMPDIFF(MINUTE, approved_time, finished_time) AS elapsed_time
            FROM submitted_transactions 
            WHERE status = 'Finished'
            ORDER BY finished_time DESC
            LIMIT 5";

                                $result = $conn->query($sql);

                                if ($result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                        // Compare the submitted transaction name with the logged-in user's full name
                                        $display_name = (!empty($row['name']) && !empty($full_name) && strtolower($row['name']) === strtolower($full_name))
                                            ? $row['name']
                                            : 'Anonymous Client';

                                        echo "<tr>";
                                        echo "<td>" . htmlspecialchars($row['request_id'] ?? '') . "</td>";
                                        echo "<td>" . htmlspecialchars($display_name ?? '') . "</td>";
                                        echo "<td>" . htmlspecialchars($row['transaction_name'] ?? '') . "</td>";
                                        echo "<td>" . htmlspecialchars($row['elapsed_time'] ?? '') . " minutes</td>";
                                        echo "</tr>";
                                    }
                                } else {
                                    echo "<tr><td colspan='4'>No finished transactions found.</td></tr>";
                                }
                                ?>
                            </tbody>
                        </table> -->
                    </div>

                </div>
            </div>
        </div>

    </div>

    <!-- Settings Navigation Menu -->
    <div class="settings-nav">
        <div class="close-btn" onclick="toggleNav()">
            <i class="fas fa-bars"></i>
        </div>
        <div class="settings-content">
            <h1>USER MENU</h1>
            <ul>
                <li><button class="nav-option active" onclick="setActive(this, 'user-details')"><i class="fas fa-user"></i>User Details</button></li>
                <li><button class="nav-option" onclick="setActive(this, 'select-transaction')"><i class="fas fa-exchange-alt"></i>Select Transaction</button></li>
                <li><button class="nav-option" onclick="setActive(this, 'transaction-history')"><i class="fas fa-history"></i>Transaction History</button></li>
                <li>
                    <button class="nav-option" onclick="setActive(this, 'waiting-page')"><i class="fas fa-clock"></i>Waiting Page</button>
                </li>
            </ul>
            <button type="submit" class="btn login-btn logout-btn" onclick="logoutUser()">
                <i class="fas fa-sign-out-alt"></i>
                <span class="text">Logout</span>
            </button>
        </div>
    </div>
    <!-- Modal to display the QR code and details -->
    <div id="qrModal" class="modal">

        <div class="modal-container">
            <div class="modal-title">
                <img src="../Images/logo.png" alt="logo">
                <h4>ETRANSACTMO QR ID</h4>
            </div>
            <div class="modal-content">
                <div class="details">
                    <p><strong>Full Name:</strong> <?php echo $full_name; ?></p>
                    <p><strong>Age:</strong> <?php echo $age; ?></p>
                    <p><strong>Gender:</strong> <?php echo $gender; ?></p>
                    <p><strong>Contact Number:</strong> <?php echo $contact_number; ?></p>
                    <p><strong>Address:</strong> <?php echo $address; ?></p>
                </div>
                <div class="qr-code">
                    <img id="qrImage" src="<?php echo $qr_code; ?>" alt="QR Code">
                </div>
            </div>
        </div>
        <div class="modal-buttons">
            <button onclick="window.print()" class="btn">Print QR ID</button>
            <button onclick="downloadQR()" class="btn">Download QR ID</button>
        </div>
    </div>
</body>

<script>
    const cardDetails = document.querySelectorAll('.card-details');

    cardDetails.forEach(container => {
        let scrollInterval;

        container.addEventListener('mouseenter', () => {
            scrollInterval = setInterval(() => {
                container.scrollTop += 1; // scrolls down by 1 pixel
            }, 60); // speed (lower = faster)
        });

        container.addEventListener('mouseleave', () => {
            clearInterval(scrollInterval);
        });


    });
</script>


</html>