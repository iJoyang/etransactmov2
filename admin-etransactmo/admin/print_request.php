<?php
// Database Connection
include('../config.php'); // Ensure this is the correct path to your connection file

// Fetch the request_id from the URL query parameters
$request_id = $_GET['id'] ?? null;

// Check if the request_id is valid
if ($request_id) {
  // Fetch the transaction details based on request_id
  $query = "SELECT * FROM submitted_transactions WHERE request_id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("i", $request_id);  // bind the request_id as an integer
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    // Fetch the transaction data as an associative array
    $transaction_details = $result->fetch_assoc();

    // Fetch the corresponding resident details using the name from the transaction
    $resident_name = $transaction_details['name']; // Assuming 'name' is the same for residents table
    $query_resident = "SELECT * FROM residents WHERE full_name = ?";
    $stmt_resident = $conn->prepare($query_resident);
    $stmt_resident->bind_param("s", $resident_name);
    $stmt_resident->execute();
    $resident_result = $stmt_resident->get_result();

    if ($resident_result->num_rows > 0) {
      // Fetch resident data
      $resident_details = $resident_result->fetch_assoc();
    } else {
      die("Resident not found.");
    }
  } else {
    die("Transaction not found.");
  }
} else {
  die("Invalid request.");
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Set the page title dynamically to the transaction_name -->
  <title><?php echo $transaction_details['transaction_name']; ?></title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    header {
      width: 100%;
      padding: 10px 0;
      text-align: center;
    }

    header img {
      width: 100%;
    }

    .print-section {
      padding: 30px;
      width: 80%;
      margin: 0 auto;
    }

    .print-section h1 {
      text-align: center;
      font-size: 1.5rem;
    }

    .print-section .signatories {
      margin-bottom: 20px;
    }

    .print-section .signatories p {
      font-size: 1rem;
      margin: 5px 0;
    }

    /* Dynamically Set the Transaction Name as the Title */
    .print-section h2 {
      text-align: center;
      font-size: 1.25rem;
      margin-top: 20px;
    }

    .print-section p {
      font-size: 1rem;
      line-height: 1.6;
      text-align: justify;
    }

    .print-section .signatures {
      margin-top: 20px;
    }

    .print-section .signatures p {
      font-size: 1rem;
      margin: 5px 0;
    }

    .print-section .affiant {
      text-align: center;
      margin-top: 40px;
    }

    .print-section .or-details {
      margin-top: 20px;
      font-size: 1rem;
    }

    .print-section .or-details p {
      margin: 5px 0;
    }

    footer {
      width: 100%;
      padding: 10px 0;
      text-align: center;
    }

    footer img {
      width: 100%;
    }
  </style>
</head>

<body>

  <!-- Header -->
  <header>
    <img src="../PIC/header.png" alt="Header Image">
  </header>

  <!-- Main Content Section -->
  <div class="print-section">
    <h1>SANGGUNIANG BARANGAY</h1>

    <div class="signatories">
      <p><strong>RODOLFO B. BELTRAN</strong><br>Punong Barangay</p>
      <p><strong>OLEMOR C. BANAC</strong><br>Barangay Kagawad</p>
      <p><strong>PETER JULY SORONGON</strong><br>Barangay Kagawad</p>
      <p><strong>ROGELIO L. BANLASAN</strong><br>Barangay Kagawad</p>
      <p><strong>PETER SHANE LIO</strong><br>Barangay Kagawad</p>
      <p><strong>EDMUND JUMAWAN JR.</strong><br>Barangay Kagawad</p>
      <p><strong>LENNIE C. BUYCO</strong><br>Barangay Kagawad</p>
      <p><strong>ALFREDO C. DAUGDAUG</strong><br>Barangay Kagawad</p>
    </div>

    <!-- Dynamic Transaction Name as Heading -->
    <h2><?php echo $transaction_details['transaction_name']; ?></h2>

    <p><strong>TO WHOM IT MAY CONCERN:</strong></p>

    <p>This is to certify that <strong><?php echo $resident_details['full_name']; ?></strong> of legal age, is a resident of <strong><?php echo $resident_details['address']; ?></strong>.</p>

    <p>This certification is being issued upon request of the above-named person for the purpose of: <strong><?php echo $transaction_details['transaction_name']; ?></strong>.</p>

    <p>Issued this <strong><?php echo date('d M Y', strtotime($transaction_details['date_requested'])); ?></strong> at Barangay Zone III, Digos City, Province of Davao del Sur.</p>

    <br><br>

    <div class="signatures">
      <p><strong>RODOLFO B. BELTRAN</strong><br>Punong Barangay</p>

      <p><strong>BY AUTHORITY OF THE PUNONG BARANGAY:</strong></p>
      <p><strong>_______________</strong><br>Barangay Kagawad, Officer of the day</p>
    </div>

    <br><br>
    <div class="affiant">
      <p><strong><?php echo $resident_details['full_name']; ?></strong><br>Affiant</p>
    </div>

    <div class="or-details">
      <p><strong>O.R No.:</strong> <span></span></p>
      <p><strong>Date Paid:</strong> <span><?php echo date('d M Y'); ?></span></p>
      <p><strong>Amount:</strong> <span></span></p>
    </div>
  </div>

  <!-- Footer -->
  <footer>
    <img src="../PIC/footer.png" alt="Footer Image">
  </footer>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>

</body>

</html>