<?php
// Include database connection
include('../config.php');

// Start session
session_start();


// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize form inputs
    $name = trim($_POST['name']);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);
    $mobile = trim($_POST['contact_number']);
    $position = trim($_POST['position']);
    $district = isset($_POST['district']) ? trim($_POST['district']) : null;
    $purok = isset($_POST['purok']) ? trim($_POST['purok']) : null;

    // Initialize response message
    $response = [];

    // Check for empty fields
    if (empty($name) || empty($username) || empty($password) || empty($confirm_password) || empty($position)) {
        $response['error'] = 'All fields are required!';
    }

    // Check if passwords match
    if ($password !== $confirm_password) {
        $response['confirm_password'] = 'Passwords do not match!';
    }

    // Check if password has at least one uppercase letter
    if (!preg_match('/[A-Z]/', $password)) {
        $response['password_uppercase'] = 'Password must have at least one uppercase letter!';
    }

    // Check if password has at least one number
    if (!preg_match('/\d/', $password)) {
        $response['password_number'] = 'Password must have at least one number!';
    }

    // Check if password has at least one special character
    if (!preg_match('/[@$!%*?&]/', $password)) {
        $response['password_special'] = 'Password must have at least one special character!';
    }

    // Check if password has at least 8 characters
    if (strlen($password) < 8) {
        $response['password_length'] = 'Password must have at least 8 characters!';
    }



    // If there are no validation errors, proceed
    if (empty($response)) {
        // Use prepared statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT admin_id FROM admin WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $response['username'] = 'Username already exists!';
        } else {
            // Hash the password securely
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Insert data into the database
            $stmt = $conn->prepare("INSERT INTO admin (name, username, password, mobile_number, position, district, purok) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $name, $username, $hashedPassword, $mobile, $position, $district, $purok);

            if ($stmt->execute()) {
                $response['success'] = 'Success';
            } else {
                $response['error'] = 'Database error: ' . $stmt->error;
            }
        }
        $stmt->close();
    }

    // Send the response back to the client
    echo json_encode($response);
    mysqli_close($conn);
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin-Login</title>
    <link rel="stylesheet" href="../css/admin_register.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="../JS/admin_register.js" defer></script>
</head>

<body>
    <div class="background">
        <!-- Logo -->
        <div class="logo-container">
            <div class="logo">
                <button class="logo-button" onclick="redirectToHome()">
                    <img src="../PIC/logo with name.png" alt="Logo" />
                </button>
            </div>
            <div class="title-text">
                <h1>Admin Registration</h1>
            </div>
        </div>

        <div class="register-form-container">
            <button onclick="redirectToAdminLogin()" class="btn back-btn">
                <span class="text"><i class="fas fa-arrow-left"></i>Go back to Login</span>
            </button>
            <hr class="line-separator-horizontal">
            <p>Please fill-in the necessary information to Register an Account</p>
            <form class="register-form" id="registration-form" action="admin_register.php" method="post">

                <div class="input-fields">
                    <!-- Name Field -->
                    <div class="input-group">
                        <label class="custom-field">
                            <input type="text" name="name" placeholder="&nbsp;" required autocomplete="off" />
                            <span class="placeholder">Enter Name</span>
                        </label>
                    </div>
                    <!-- Username Field -->
                    <div class="input-group">
                        <label class="custom-field">
                            <input type="text" name="username" id="username" placeholder="&nbsp;" required autocomplete="off" />
                            <span class="placeholder">Enter Username</span>
                        </label>
                        <p id="username-error" style="color: red; font-size: 0.9em;"></p>
                    </div>
                </div>

                <div class="line-separator-vertical"></div>

                <div class="input-fields">
                    <!-- Password Field -->
                    <div class="input-group">
                        <label class="custom-field">
                            <input type="password" name="password" id="password" placeholder="&nbsp;" required />
                            <span class="placeholder">Enter Password</span>
                            <button type="button" id="toggle-password" class="toggle-password">
                                <i id="eye-icon-password" class="fas fa-eye"></i>
                            </button>
                        </label>

                        <div id="password-instructions" style="color: gray;">
                            <p id="password-length">Password must have at least 8 characters.</p>
                            <p id="password-uppercase">Password must include at least one uppercase letter [A-Z].</p>
                            <p id="password-number">Password must include at least one number.</p>
                            <p id="password-special">Password must include at least one special character [@$!%*?&].</p>
                        </div>
                    </div>
                    <!-- Confirm Password Field -->
                    <div class="input-group">
                        <label class="custom-field">
                            <input type="password" name="confirm_password" id="confirm_password" placeholder="&nbsp;" required />
                            <span class="placeholder">Confirm Password</span>
                            <button type="button" id="toggle-confirm-password" class="toggle-password">
                                <i id="eye-icon-confirm-password" class="fas fa-eye"></i>
                            </button>
                        </label>
                        <p id="confirm-password-error" style="color: red; font-size: 0.9em;"></p>
                        <p id="password-match-message" style="font-size: 0.9em;"></p>
                    </div>
                </div>

                <div class="line-separator-vertical"></div>

                <div class="input-fields">
                    <!-- Mobile Number Field -->
                    <div class="input-group">
                        <label class="custom-field">
                            <input type="text" name="contact_number" required id="contact_number"
                                required autocomplete="off"
                                value="+63"
                                maxlength="13"
                                oninput="validateContactNumber()"
                                onfocus="this.setSelectionRange(3, 3)" />
                            <span class="placeholder">Enter Contact Number</span>
                        </label>
                    </div>
                    <div class="input-group">
                        <label class="custom-field">
                            <select name="position" id="position" required onchange="toggleSelectFields()">
                                <option value="" selected>&nbsp;</option>
                                <option value="purok-leader">Purok Leader</option>
                                <option value="administrator">Barangay Administrator</option>
                                <option value="captain">Barangay Captain</option>
                            </select>
                            <span class="placeholder-fixed">Position</span>
                        </label>
                    </div>
                    <div class="input-group">
                        <label class="custom-field">
                            <select id="district" name="district" required onchange="updatePurokOptions()">
                                <option value="">&nbsp;</option>
                                <option value="1">District 1</option>
                                <option value="2">District 2</option>
                                <option value="3">District 3</option>
                                <option value="4">District 4</option>
                                <option value="5">District 5</option>
                                <option value="6">District 6</option>
                                <option value="7">District 7</option>
                            </select>
                            <span class="placeholder-fixed">District</span>
                        </label>
                    </div>
                    <div class="input-group">
                        <label class="custom-field">
                            <select id="purok" name="purok" required>
                                <option value="">&nbsp;</option>
                            </select>
                            <span class="placeholder-fixed">Purok</span>
                        </label>
                    </div>
                </div>
            </form>
            <button type="submit" class="btn submit-btn" onclick="return submitForm()">
                <span class="text">Register</span>
            </button>
        </div>

        <div id="loadingMessage">
            <img id="loadingLogo" src="../PIC/logo.png" alt="Loading">
        </div>
    </div>
</body>

</html>