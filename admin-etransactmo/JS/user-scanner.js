document.addEventListener("DOMContentLoaded", () => {
  // Redirection with delay and show loading message
  function redirectWithDelay(url, delay) {
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) {
      console.log("Loading element found, showing animation...");
      loadingMessage.style.display = "flex";
      loadingMessage.style.flexDirection = "column";
      setTimeout(() => {
        if (url) {
          window.location.replace(url); // Redirect after delay
        } else {
          console.error("No valid URL provided for redirection.");
        }
      }, delay);
    } else {
      console.warn("Loading message element not found.");
    }
  }

  // Global redirection functions
  function redirectToHome() {
    redirectWithDelay("../../index.html", 1000);
  }

  function redirectToGenerateQR() {
    redirectWithDelay("../User-side/user-register.php", 1000);
  }

  // Attach functions to the window object for global access
  window.redirectToHome = redirectToHome;
  window.redirectToGenerateQR = redirectToGenerateQR;

  // Initialize QR Scanner setup
  const previewElement = document.getElementById("preview");
  if (!previewElement) {
    console.error("Preview element for scanner not found.");
    return;
  }
  previewElement.style.removeProperty("width");
  previewElement.style.removeProperty("height");

  // Initialize Instascan
  const scanner = new Instascan.Scanner({
    video: previewElement,
    scanPeriod: 5,
    mirror: true,
  });

  const loggingSound = new Audio("../Images/logging.mp3");
  const tryagainSound = new Audio("../Images/tryagain.mp3");

  scanner.addListener("scan", (content) => {
    verifyQRCode(content); // Handle the scanned content
  });

  // Access camera and start scanner
  Instascan.Camera.getCameras()
    .then((cameras) => {
      if (cameras.length > 0) {
        scanner.start(cameras[0]).catch((err) => {
          console.error("Error starting camera:", err);
          alert("Error starting the camera.");
        });
      } else {
        alert("No cameras found.");
      }
    })
    .catch((error) => {
      console.error("Camera error:", error);
      alert("Error accessing camera.");
    });

  const qrUpload = document.getElementById("qrUpload");
  qrUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.src = reader.result;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Convert image to QR code data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );

          if (qrCode) {
            verifyQRCode(qrCode.data);
          } else {
            Swal.fire({
              icon: "error",
              title: "Invalid Image",
              text: "No QR code detected in the uploaded image.",
              confirmButtonText: "OK",
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  });

  // Verify QR Code
  function verifyQRCode(encryptedData) {
    fetch("user-verifyQR.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "encrypted_data=" + encodeURIComponent(encryptedData),
    })
      .then((response) => response.text())
      .then((text) => {
        try {
          console.log("Server Response:", text);
          return JSON.parse(text);
        } catch (error) {
          console.error("Invalid JSON response:", text);
          throw new Error("Server returned invalid JSON");
        }
      })
      .then((data) => {
        if (data.success) {
          loggingSound.play().catch((error) => {
            console.error("Error playing login sound:", error);
          });
          redirectWithDelay("user-dashboard.php", 3000); // 3-second delay
        } else {
          tryagainSound.play().catch((error) => {
            console.error("Error playing tryagain sound:", error);
          });
          Swal.fire({
            icon: "error",
            title: "Invalid QR Code",
            text: "Your QR Code is invalid, please try again.",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        console.error("Error processing QR code:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error processing QR code.",
          confirmButtonText: "OK",
        });
      });
  }

  document.getElementById("qrUpload").addEventListener("change", function () {
    const fileName = this.files[0] ? this.files[0].name : "No file chosen";
    document.getElementById("fileName").textContent = fileName;
  });
});
