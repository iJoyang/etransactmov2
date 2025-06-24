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

  let scanner = null;
  let cameras = [];
  let currentCamIndex = 0;
  const previewElement = document.getElementById("preview");

  // Stop all media streams (important to release resources before switching)
  function stopAllStreams() {
    const stream = previewElement.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      previewElement.srcObject = null;
    }
  }

  // Start the scanner with a specific camera
  async function startScanner(cameraIndex) {
    try {
      // Stop existing scanner if running
      if (scanner) {
        await scanner
          .stop()
          .catch((err) => console.warn("Error stopping scanner:", err));
      }

      // Stop any media stream
      stopAllStreams();

      // Wait before switching to allow the camera stream to release (important on mobile)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refetch cameras to make sure we have the latest list
      cameras = await Instascan.Camera.getCameras();

      if (cameras.length === 0) throw new Error("No cameras found.");
      if (!cameras[cameraIndex]) cameraIndex = 0;

      const selectedCam = cameras[cameraIndex];
      const isBackCam = selectedCam.name.toLowerCase().includes("back");

      // Recreate scanner with the appropriate mirror option
      scanner = new Instascan.Scanner({
        video: previewElement,
        scanPeriod: 5,
        mirror: !isBackCam, // Mirror front camera, don't mirror back camera
      });

      // Add a listener to handle QR code scanning
      scanner.addListener("scan", (content) => {
        verifyQRCode(content);
      });

      // Start the scanner with the selected camera
      await scanner.start(selectedCam);
      currentCamIndex = cameraIndex; // Update the current camera index
    } catch (error) {
      console.error("Error starting camera:", error);
      alert("Error starting the camera.");
    }
  }

  // Initialize camera setup on page load
  Instascan.Camera.getCameras()
    .then(async (cams) => {
      cameras = cams;
      if (cams.length > 0) {
        await startScanner(0); // Start with the first available camera
        console.log("Camera Index: ", currentCamIndex);
      } else {
        alert("No cameras found.");
      }
    })
    .catch((err) => {
      console.error("Camera error:", err);
      alert("Error accessing camera.");
    });

  // Switch between cameras when the button is clicked
  document
    .getElementById("switchCamBtn")
    .addEventListener("click", async () => {
      if (cameras.length > 0) {
        // Cycle through cameras (handle both directions, next and previous)
        currentCamIndex = currentCamIndex === 0 ? 1 : 0;
        console.log("Camera Index: ", currentCamIndex);
        await startScanner(currentCamIndex); // Start the selected camera
      }
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

  const loggingSound = new Audio("../Images/logging.mp3");
  const tryagainSound = new Audio("../Images/tryagain.mp3");
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
