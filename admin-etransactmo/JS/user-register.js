// Redirect with delay and show loading message
function redirectWithDelay(url, delay) {
  // Add 'active' class to qrcode-content
  document.getElementById("loadingMessage").style.display = "flex";

  // Redirect after delay and pass a URL parameter
  setTimeout(() => window.location.replace(url + "&activate_qr=1"), delay);
}

function redirectToAdminHome() {
  redirectWithDelay("../admin/admin_dashboard.php", 3000);
}

function redirectToAdminHomeQRContent() {
  redirectWithDelay("../admin/admin_dashboard.php?show=qrcode", 3000);
}

// Window onload to handle modal display
window.onload = function () {
  var modal = document.getElementById("qrModalFromRegister");
  var modalStatus = document.body.getAttribute("data-modal-status");

  if (modalStatus === "show") modal.style.display = "block";

  window.onclick = function (event) {
    if (event.target == modal) {
    }
  };
};

// Download QR as PNG
function downloadQR() {
  const modalContent = document.querySelector(
    "#qrModalFromRegister .modal-container"
  );

  html2canvas(modalContent, { useCORS: true, scale: 5 })
    .then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "QR_ID.png";
      link.click();
      redirectToAdminHomeQRContent();
    })
    .catch((error) => console.error("Failed to capture the modal:", error));
}

// Fetch data from URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Load regions into the dropdown
async function loadRegions() {
  const regions = await fetchData("https://psgc.gitlab.io/api/regions/");
  const regionSelect = document.getElementById("region");

  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region.code;
    option.text = region.name;
    regionSelect.add(option);
  });

  regionSelect.value = "110000000";
  loadProvinces("110000000");
}

// Load provinces based on region selection
async function loadProvinces(regionCode) {
  const provinces = await fetchData(
    `https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`
  );
  const provinceSelect = document.getElementById("province");
  provinceSelect.innerHTML = "<option value=''>Select Province</option>";

  provinces.forEach((province) => {
    const option = document.createElement("option");
    option.value = province.code;
    option.text = province.name.toUpperCase();
    provinceSelect.add(option);
  });

  if (regionCode === "110000000") {
    provinceSelect.value = "112400000";
    loadCities("112400000");
  }
}

// Load cities based on province selection
async function loadCities(provinceCode) {
  const cities = await fetchData(
    `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
  );
  const citySelect = document.getElementById("city");
  citySelect.innerHTML = "<option value=''>Select City/Municipality</option>";

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.code;
    option.text = city.name.toUpperCase();
    citySelect.add(option);
  });

  if (provinceCode === "112400000") {
    citySelect.value = "112403000";
    loadBarangays("112403000");
  }
}

// Load barangays based on city selection
async function loadBarangays(cityCode) {
  const barangays = await fetchData(
    `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`
  );
  const barangaySelect = document.getElementById("barangay");
  barangaySelect.innerHTML = "<option value=''>&nbsp;</option>";

  barangays.forEach((barangay) => {
    const option = document.createElement("option");
    option.value = barangay.code;
    option.text = barangay.name.toUpperCase();
    barangaySelect.add(option);
  });

  if (cityCode === "112403000") {
    barangaySelect.value = "112403030";
  }
}

// Initialize regions on page load
loadRegions();

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
    }
  });

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
  }

  return isValid; // Allow form submission only if all fields are valid
}

// Function to dynamically reset red border
function resetFieldBorder(event) {
  const field = event.target;

  // Reset red border if the field is no longer empty or invalid
  if (field.value.trim() && field.style.borderColor === "red") {
    field.style.borderColor = ""; // Reset to default
    field.title = ""; // Remove tooltip
  }

  // Special case for the contact number
  if (
    field.id === "contact_number" &&
    field.value.startsWith("+63") &&
    field.value.length === 13
  ) {
    field.style.borderColor = ""; // Reset to default
    field.title = ""; // Remove tooltip
  }
}

// Attach event listeners for dynamic validation
document.querySelectorAll(".register-form [required]").forEach((field) => {
  field.addEventListener("input", resetFieldBorder);
  field.addEventListener("change", resetFieldBorder);
});
