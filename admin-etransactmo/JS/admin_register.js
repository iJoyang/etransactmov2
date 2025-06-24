// Redirect to admin login page
function redirectToAdminLogin() {
  redirectWithDelay("../admin/admin_login.php", 1000);
}

// Global redirection functions
function redirectToHome() {
  redirectWithDelay("../../../index.html", 1000);
}

// Redirection with delay
function redirectWithDelay(url, delay) {
  document.getElementById("loadingMessage").style.display = "flex";
  setTimeout(() => window.location.replace(url), delay);
}

// Function to check password validity and color instructions
function checkPasswordStrength() {
  const password = document.getElementById("password").value;

  // Password instructions
  const passwordLength = document.getElementById("password-length");
  const passwordUppercase = document.getElementById("password-uppercase");
  const passwordNumber = document.getElementById("password-number");
  const passwordSpecial = document.getElementById("password-special");

  // Check if password meets criteria
  if (password.length >= 8) {
    passwordLength.style.color = "green";
  } else {
    passwordLength.style.color = "red";
  }

  if (/[A-Z]/.test(password)) {
    passwordUppercase.style.color = "green";
  } else {
    passwordUppercase.style.color = "red";
  }

  if (/\d/.test(password)) {
    passwordNumber.style.color = "green";
  } else {
    passwordNumber.style.color = "red";
  }

  if (/[@$!%*?&]/.test(password)) {
    passwordSpecial.style.color = "green";
  } else {
    passwordSpecial.style.color = "red";
  }
}

// Add event listener to password field to check strength on input
document
  .getElementById("password")
  .addEventListener("input", checkPasswordStrength);

// Function to check if the password and confirm password match
function checkPasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const matchMessage = document.getElementById("password-match-message");

  // Check if passwords match
  if (password === confirmPassword && password !== "") {
    matchMessage.innerText = "Password matched!";
    matchMessage.style.color = "green"; // You can style it as per your preference
    document.getElementById("confirm_password").style.border =
      "2px solid black";
  } else {
    matchMessage.innerText = ""; // Clear the message when they don't matchmatchMessage.innerText = "Passwords do not match!";
    matchMessage.style.color = "red"; // Red message for mismatch
    document.getElementById("confirm_password").style.border = "2px solid red";
  }
}

// Add event listener to confirm password field to check match on input
document
  .getElementById("confirm_password")
  .addEventListener("input", checkPasswordMatch);

// Add event listener to password field to clear confirm password and error messages when password input has errors
document.getElementById("password").addEventListener("input", function () {
  document.getElementById("confirm_password").value = ""; // Clear confirm password field
  document.getElementById("password-match-message").innerText = ""; // Clear match message
});

// Get the password input, confirm password input, and eye icons
const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirm_password");
const togglePasswordButton = document.getElementById("toggle-password");
const toggleConfirmPasswordButton = document.getElementById(
  "toggle-confirm-password"
);
const eyeIconPassword = document.getElementById("eye-icon-password");
const eyeIconConfirmPassword = document.getElementById(
  "eye-icon-confirm-password"
);

// Toggle password visibility
togglePasswordButton.addEventListener("click", function () {
  const type = passwordField.type === "password" ? "text" : "password";
  passwordField.type = type;
  eyeIconPassword.classList.toggle("fa-eye-slash"); // Toggle the eye icon
});

// Toggle confirm password visibility
toggleConfirmPasswordButton.addEventListener("click", function () {
  const type = confirmPasswordField.type === "password" ? "text" : "password";
  confirmPasswordField.type = type;
  eyeIconConfirmPassword.classList.toggle("fa-eye-slash"); // Toggle the eye icon
});

function validateContactNumber(event) {
  var input = document.getElementById("contact_number");
  var currentValue = input.value;

  // Ensure the input starts with +63 and allow modification only of digits
  if (currentValue.startsWith("+63")) {
    input.value = "+63" + currentValue.slice(3).replace(/[^0-9]/g, "");
  } else {
    input.value = "+63";
  }

  // Limit the total input length to 13 characters (10 digits after +63)
  if (currentValue.length > 13) {
    input.value = currentValue.slice(0, 13);
  }
}

function updatePurokOptions() {
  const district = document.getElementById("district").value;
  const purok = document.getElementById("purok");

  // Clear existing options
  purok.innerHTML = '<option value="">&nbsp;</option>'; // Reset placeholder

  // Define options for each district
  const purokOptions = {
    1: [
      "Purok Avocado",
      "Purok Durian",
      "Purok Granada",
      "Purok Labana",
      "Purok Lansones",
      "Purok Marang/Mansanas",
      "Purok Nangka",
      "Purok Pakwan",
      "Purok Pinya",
      "Purok Rambutan",
      "Purok Saging",
      "Purok Santol",
      "Purok Tambis/Lomboy",
      "Purok Chico",
      "Purok Ubas",
    ],
    2: [
      "Purok Acacia",
      "Purok Almasiga",
      "Purok Apitong",
      "Purok Balite/Ypil",
      "Purok Gemelina",
      "Purok Kamagong",
      "Purok Lawaan",
      "Purok Mahogany",
      "Purok Molave",
      "Purok Narra",
      "Purok Neem Tree",
      "Purok Pine Tree",
      "Purok Talisay",
      "Purok Tindalo",
      "Purok Tugas",
      "Purok Yakal",
      "Purok Indian Tree",
    ],
    3: [
      "Purok Aguila",
      "Purok Gorion",
      "Purok Maya",
      "Purok Woodpecker",
      "Purok Kalapati",
      "Purok Lovebirds",
      "Purok Ostrich",
      "Purok Kalaw",
      "Purok Kingfisher",
      "Purok Tamsi",
      "Purok Parrot",
    ],
    4: [
      "Purok Arowana",
      "Purok Balo",
      "Purok Bangus",
      "Purok Bariles",
      "Purok Bolinao",
      "Purok Flowerhorn",
      "Purok Lapu-Lapu",
      "Purok Maya-Maya",
      "Purok Talakitok",
      "Purok Tangigue",
    ],
    5: [
      "Purok Ampalaya",
      "Purok Cabbage",
      "Purok Cadios",
      "Purok Carrots",
      "Purok Camansi",
      "Purok Eggplant",
      "Purok Malunggay",
      "Purok Pechay",
      "Purok Stringbeans",
    ],
    6: [
      "Purok Camel A",
      "Purok Camel B",
      "Purok Cobra",
      "Purok Dragon",
      "Purok Elephant A",
      "Purok Elephant B",
      "Purok Kangaroo",
      "Purok Skylark",
      "Purok Panther",
      "Purok Jaguar",
      "Purok Tamaraw",
      "Purok Carabao",
    ],
    7: [
      "Purok Cattleya",
      "Purok Daisy",
      "Purok Everlasting",
      "Purok Gumamela",
      "Purok Ilang-Ilang",
      "Purok Orchids",
      "Purok Sakura",
      "Purok Sampaguita",
      "Purok San Francisco",
      "Purok Santan",
      "Purok Waling-Waling",
    ],
  };

  // Add new options based on the selected district
  if (district && purokOptions[district]) {
    purokOptions[district].forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option; // Preserve original text with spaces
      opt.textContent = option;
      purok.appendChild(opt);
    });
  }
}

function toggleSelectFields() {
  var position = document.getElementById("position").value;
  var districtSelect = document.getElementById("district");
  var purokSelect = document.getElementById("purok");

  // Check the selected value of the position field
  if (position === "purok-leader") {
    // Enable both district and purok select fields if Purok Leader is selected
    districtSelect.disabled = false;
    purokSelect.disabled = false;
    districtSelect.required = true;
    purokSelect.required = true;
  } else if (position === "administrator" && "captain") {
    // Disable both district and purok select fields if Barangay Administrator is selected
    districtSelect.disabled = true;
    purokSelect.disabled = true;
    districtSelect.required = false;
    purokSelect.required = false;
  } else {
    // Reset the state if no valid position is selected
    districtSelect.disabled = true;
    purokSelect.disabled = true;
    districtSelect.required = false;
    purokSelect.required = false;
  }
}

// Initial function call to set the correct state on page load
window.onload = function () {
  toggleSelectFields();
};

// Function to validate the form before submission
function validateForm() {
  const form = document.querySelector(".register-form");
  const fields = form.querySelectorAll("[required]");
  let isValid = true;

  // Reset all field styles
  fields.forEach((field) => {
    field.style.borderColor = ""; // Reset border color
    field.title = ""; // Remove tooltips
  });

  // Check each required field
  fields.forEach((field) => {
    if (
      !field.value.trim() ||
      (field.type === "radio" &&
        !form.querySelector(`input[name="${field.name}"]:checked`))
    ) {
      isValid = false;
      field.style.borderColor = "red"; // Highlight field with red border
      field.title = "This field is required"; // Add tooltip for feedback
    } else {
      field.style.borderColor = "green"; // Mark field as valid
    }
  });

  // Check if username is taken
  const usernameField = document.getElementById("username");
  const username = usernameField.value.trim();

  if (username === "") {
    isValid = false;
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "check_username.php", false); // Synchronous request to wait for the response
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        if (xhr.responseText === "taken") {
          usernameField.style.border = "2px solid red";
          usernameField.title = "Username is already taken";
          isValid = false;
        } else {
          usernameField.style.border = "2px solid green";
          usernameField.title = "Username is available";
        }
      }
    };

    xhr.send("username=" + encodeURIComponent(username));
  }

  // Special case for the contact number
  const contactNumber = document.getElementById("contact_number");
  if (
    contactNumber &&
    (contactNumber.value.length !== 13 ||
      !contactNumber.value.startsWith("+63"))
  ) {
    isValid = false;
    contactNumber.style.borderColor = "red"; // Highlight contact number
    contactNumber.title =
      "Please enter a valid contact number (e.g., +639123456789)";
  } else {
    contactNumber.style.borderColor = "green"; // Mark as valid
  }

  // Validate password criteria
  const passwordField = document.getElementById("password");
  if (!isPasswordValid(passwordField.value)) {
    isValid = false;
    passwordField.style.border = "2px solid red"; // Highlight password field
  } else {
    passwordField.style.border = "2px solid green"; // Mark as valid
  }

  // Validate confirm password
  const confirmPasswordField = document.getElementById("confirm_password");
  if (confirmPasswordField.value !== passwordField.value) {
    isValid = false;
    confirmPasswordField.style.border = "2px solid red"; // Highlight confirm password field
    confirmPasswordField.title = "Passwords do not match";
  } else if (confirmPasswordField.value.trim() !== "") {
    confirmPasswordField.style.border = "2px solid green"; // Mark as valid
  }

  return isValid; // Allow form submission only if all fields are valid
}

// Function to check if the password meets criteria
function isPasswordValid(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
}

// Function to dynamically validate and reset field borders
function resetFieldBorder(event) {
  const field = event.target;

  // If field is required and filled, make the border green
  if (field.value.trim()) {
    field.style.borderColor = "green";
    field.title = ""; // Remove tooltip
  }

  // Special case for the contact number
  if (
    field.id === "contact_number" &&
    field.value.startsWith("+63") &&
    field.value.length === 13
  ) {
    field.style.borderColor = "green"; // Mark as valid
  } else if (field.id === "contact_number") {
    field.style.borderColor = "red"; // Mark as invalid
  }

  // Special case for password field
  if (field.id === "password") {
    if (isPasswordValid(field.value)) {
      field.style.border = "2px solid green"; // Mark as valid
    } else {
      field.style.border = "2px solid red"; // Mark as invalid
    }
  }

  // Special case for confirm password field
  const passwordField = document.getElementById("password");
  if (field.id === "confirm_password") {
    if (field.value === passwordField.value && field.value.trim() !== "") {
      field.style.border = "2px solid green"; // Match password
    } else {
      field.style.border = "2px solid red"; // Mismatch
    }
  }
}

// Attach event listeners for dynamic validation
document.querySelectorAll(".register-form [required]").forEach((field) => {
  field.addEventListener("input", resetFieldBorder);
  field.addEventListener("change", resetFieldBorder);
});

function submitForm() {
  const form = document.querySelector(".register-form");

  if (validateForm()) {
    const formData = new FormData(form);

    // Send form data using AJAX instead of submitting normally
    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        if (data.success === "Success") {
          // Check server response
          redirectToAdminLogin(); // Redirect if successful
        } else {
          alert("Registration failed. Please try again."); // Handle failure
        }
      })
      .catch((error) => console.error("Error:", error));
  }
}
