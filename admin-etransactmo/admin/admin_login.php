<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unified Login</title>
    <link rel="stylesheet" href="../css/admin_login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="../JS/admin_login.js" defer></script>
</head>

<body>
    <div class="background">
        <div class="logo-container">
            <div class="logo">
                <button class="logo-button" onclick="redirectToHome()">
                    <img class="logo_size" src="../PIC/logo with name.png" alt="Logo" />
                </button>
            </div>
        </div>

        <div class="login-container">
            <div class="title-text">
                <h1>LOGIN</h1>
            </div>
            <form class="slide-in" id="login-form">
                <!-- Login Role Selection -->
                <div class="input-group">
                    <label class="custom-field">
                        <select id="position" required onchange="updatePlaceholder()">
                            <option value="" disabled selected>Select Position</option>
                            <option value="purok-leader">Purok Leader</option>
                            <option value="administrator">Barangay Administrator</option>
                            <option value="captain">Barangay Captain</option>
                        </select>
                    </label>
                </div>
                <br>
                <!-- Username/Email Field -->
                <div class="input-group">
                    <label class="custom-field">
                        <input type="text" id="username" placeholder="&nbsp;" required autocomplete="off" />
                        <span class="placeholder">Enter Username</span>
                    </label>
                </div>
                <br>
                <!-- Password Field -->
                <div class="input-group">
                    <label class="custom-field">
                        <input type="password" id="password" placeholder="&nbsp;" required />
                        <span class="placeholder">Enter Password</span>
                    </label>
                </div>

                <p>No Account? <a href="javascript:void(0)" onclick="redirectToAdminRegister()">Click Here to Register</a></p>
                <br>
                <!-- Login Button -->
                <button type="submit" class="btn login-btn">
                    <span class="text">Login</span>
                </button>
            </form>
        </div>

        <div id="loadingMessage">
            <img id="loadingLogo" src="../PIC/logo.png" alt="Loading">
        </div>
    </div>
</body>

</html>