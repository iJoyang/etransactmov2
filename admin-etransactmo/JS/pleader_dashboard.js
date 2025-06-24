document.addEventListener("DOMContentLoaded", () => {
  function logout() {
    window.location.href = "../admin/logout.php";
  }

  document.querySelector(".logout-btn").addEventListener("click", logout);
});

function showModal(button) {
  // Extract data from button
  const fullName = button.getAttribute("data-fullname");
  const age = button.getAttribute("data-age");
  const gender = button.getAttribute("data-gender");
  const contact = button.getAttribute("data-contact");
  const address = button.getAttribute("data-address");
  const qrCode = button.getAttribute("data-qr");

  // Set modal content
  document.getElementById("modalFullName").innerText = fullName;
  document.getElementById("modalAge").innerText = age;
  document.getElementById("modalGender").innerText = gender;
  document.getElementById("modalContact").innerText = contact;
  document.getElementById("modalAddress").innerText = address;
  document.getElementById("qrImg").src = qrCode;

  // Show modal
  document.getElementById("qrModal").style.display = "block";
}

// Function to close the modal
function closeModal(event) {
  const modal = document.getElementById("qrModal");
  if (event.target === modal) {
    // If the backdrop (outside the modal content) is clicked
    modal.style.display = "none"; // Close the modal
  }
}

// Download QR as PNG
function downloadQRID() {
  const modalContent = document.querySelector("#qrModal .modal-container");

  html2canvas(modalContent, { useCORS: true, scale: 5 })
    .then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "QR_ID.png";
      link.click();
      // Show modal
      document.getElementById("qrModal").style.display = "none";
    })
    .catch((error) => console.error("Failed to capture the modal:", error));
}

function confirmDelete(button) {
  const residentId = button.getAttribute("data-id");

  if (!residentId) {
    alert("Resident ID is missing!");
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("delete_resident.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${residentId}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Deleted!", data.message, "success").then(() => {
              location.reload();
            });
          } else {
            Swal.fire("Error!", data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error!", "Unexpected error occurred.", "error");
        });
    }
  });
}


function showGenerateQRModal() {
  var modal = document.getElementById("generateQRModal");
  modal.style.display = "block";
}

function closeQRModal() {
  var modal = document.getElementById("generateQRModal");
  modal.style.display = "none";
}
