const settingsNav = document.querySelector(".settings-nav");
const closeBtn = document.querySelector(".close-btn");
const icon = document.querySelector(".close-btn i");
const cards = document.querySelectorAll(".card");
const submitButton = document.getElementById("submit-button");
const waitingPageContent = document.querySelector(
  "#waiting-page .dashboard-content"
);
// Get the loading circle element
const loadingCircle = document.querySelector(".loading-circle");
const countdownElement = document.querySelector(".countdown");
const progressBarFill = document.querySelector(".progress-bar-fill");
const progressLiquid = document.querySelector(".progress-liquid"); // Element for liquid animation

let selectedTransactions = [];
let countdownInterval = null; // Store the interval ID for countdown
let countdownEnd = sessionStorage.getItem("countdownEnd") || 0; // Store the countdown end time
let savedProgressPercentage =
  sessionStorage.getItem("progressPercentage") || "0";
let savedProgressBarWidth = sessionStorage.getItem("progressBarWidth") || "0%";
let cardSelectionState = {}; // Track the state of each card (selected or not)
// Variables to track the number of finished and remaining requests
// Initialize requests from sessionStorage or set to 0 if not present
let finishedRequests =
  parseInt(sessionStorage.getItem("finishedRequests")) || 0;
let remainingRequests =
  parseInt(sessionStorage.getItem("remainingRequests")) || 0;
// Load saved requests from sessionStorage

// Toggle Settings Navigation
function toggleNav() {
  settingsNav.classList.toggle("active");
  closeBtn.classList.toggle("active");
}

// Close the navbar when a notification pops up
function closeNavOnNotification() {
  settingsNav.classList.remove("active");
  closeBtn.classList.remove("active");
}

// Add hover event listener to the icon
icon.addEventListener("mouseenter", () => {
  settingsNav.classList.add("borders-white");
  closeBtn.classList.add("borders-white");
});

icon.addEventListener("mouseleave", () => {
  settingsNav.classList.remove("borders-white");
  closeBtn.classList.remove("borders-white");
});

// Logout user
function logoutUser() {
  window.location.href = "user-logout.php";
}

// Disable back and forward buttons
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(0);
};

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const transactionId = card.getAttribute("data-id");

    if (card.classList.contains("selected")) {
      // If card is already selected, deselect it
      card.classList.remove("selected");

      // Remove transactionId from the selectedTransactions array
      selectedTransactions = selectedTransactions.filter(
        (id) => id !== transactionId
      );
    } else {
      // If card is not selected, select it
      card.classList.add("selected");

      // Add transactionId to the selectedTransactions array only if it's not already there
      if (!selectedTransactions.includes(transactionId)) {
        selectedTransactions.push(transactionId);
      }
    }
    updateSelectedCount();
    updateRequestStatus();
  });
  // Add flip functionality
  card.addEventListener("mouseenter", () => {
    card.classList.add("flipped"); // Flip on hover
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("flipped"); // Flip back on hover out
  });
});

// Update selected transaction count
function updateSelectedCount() {
  const countDisplay = document.getElementById("selected-count");
  countDisplay.innerText = `Selected Transactions: ${selectedTransactions.length}`;
  submitButton.disabled = selectedTransactions.length === 0;
}

function updateRequestStatus() {
  document.getElementById("finishedRequest").textContent = finishedRequests;
  document.getElementById("remainingRequest").textContent = remainingRequests;

  sessionStorage.setItem("finishedRequests", finishedRequests);
  sessionStorage.setItem("remainingRequests", remainingRequests);
}

// Reset finishedRequests when the countdown reaches 0
function resetFinishedRequests() {
  finishedRequests = 0;
  remainingRequests = 0;
  sessionStorage.setItem("finishedRequests", finishedRequests);
  sessionStorage.setItem("remainingRequests", remainingRequests);
  updateRequestStatus();
}

// Extend the countdown based on the number of selected cards
function extendCountdown() {
  const additionalMinutes = 15 * selectedTransactions.length; // 15 minutes per card
  const additionalTime = additionalMinutes * 60 * 1000; // Convert to milliseconds

  const now = new Date().getTime();

  // Get current countdown end time from sessionStorage
  let storedCountdownEnd =
    parseInt(sessionStorage.getItem("countdownEnd")) || 0;

  // If countdown has expired or not set, start a new countdown from now
  if (!storedCountdownEnd || storedCountdownEnd < now) {
    countdownEnd = now + additionalTime;
  } else {
    countdownEnd = storedCountdownEnd + additionalTime; // Add new time to existing countdown
  }

  sessionStorage.setItem("countdownEnd", countdownEnd);

  const newTotalDuration =
    (remainingRequests + selectedTransactions.length) * 15 * 60 * 1000;
  sessionStorage.setItem("totalDuration", newTotalDuration);

  startCountdownFromSession(); // Restart countdown with the new time
}

countdownElement.classList.add("hidden-animation");
countdownElement.textContent = "00:00"; // Set initial countdown format to "00:00"

document.addEventListener("DOMContentLoaded", function () {
  // Fetch status and time for countdown
  fetch("user-dashboard.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "approved" && data.time_requested) {
        startCountdownFromRequest(data.time_requested, data.date_requested);
      }
    })
    .catch((error) => console.error("Error fetching timer:", error));
  console.log("data.status");

  if (countdownEnd && countdownEnd > new Date().getTime()) {
    startCountdownFromSession();
  }

  updateFunFact();
  updateRequestStatus();
});

function startCountdownFromRequest(timeRequested, dateRequested) {
  const requestTime = new Date(`${dateRequested} ${timeRequested}`);
  const now = new Date();
  const timeDiff = countdownEnd - now;

  if (timeDiff > 0) {
    countdownEnd = now.getTime() + timeDiff;
    sessionStorage.setItem("countdownEnd", countdownEnd);
    startCountdownFromSession();
  } else {
    countdownElement.textContent = "00:00";
  }
}

const userId = sessionStorage.getItem("userId");
const countdowns = {};

function fetchTransactionUpdates() {
  fetch("fetch-data.php")
    .then((response) => response.text())
    .then((text) => {
      try {
        return JSON.parse(text);
      } catch (error) {
        console.error("Invalid JSON response:", text);
        throw new Error("Invalid JSON: " + text);
      }
    })
    .then((data) => {
      console.log("Fetched Data:", data);

      data.forEach((transaction) => {
        const transactionId = transaction.request_id;

        if (!transactionId) {
          console.warn("Missing transaction ID:", transaction);
          return;
        }

        if (transaction.status === "approved" && !countdowns[transaction.id]) {
          startCountdownFromSession(transactionId, transaction.duration || 900);
        } else if (
          transaction.status !== "approved" &&
          countdowns[transactionId]
        ) {
          resetCountdown(transactionId);
        }
      });
    })
    .catch((error) =>
      console.error("Error fetching transaction updates:", error)
    );
}

// Run fetchTransactionUpdates every 5 seconds
setInterval(fetchTransactionUpdates, 5000);

function updateTransactionStatus(transactionId, newStatus) {
  fetch("update-status.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: transactionId, status: newStatus }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(`Transaction ${transactionId} updated to ${newStatus}`);
      }
    })
    .catch((error) =>
      console.error("Error updating transaction status:", error)
    );
}

function startCountdownFromSession(transactionId) {
  const endTime =
    parseInt(sessionStorage.getItem(`countdown-${transactionId}`)) || 0;
  if (!endTime || new Date().getTime() >= endTime) {
    resetCountdown(transactionId);
    return;
  }

  countdowns[transactionId] = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      clearInterval(countdowns[transactionId]);
      delete countdowns[transactionId];
      updateTransactionStatus(transactionId, "finished");
      resetCountdown(transactionId);
      return;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    document.getElementById(
      `countdown-${transactionId}`
    ).textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    let totalDuration = parseInt(sessionStorage.getItem("totalDuration")) || 1;
    let elapsedTime = totalDuration - timeLeft;
    let progressPercentage = (elapsedTime / totalDuration) * 100;
    document.querySelector(
      ".progress-percentage"
    ).textContent = `${progressPercentage.toFixed(0)}%`;
    document.querySelector(".progress-bar-fill").style.width = `${Math.max(
      progressPercentage,
      0
    )}%`;

    sessionStorage.setItem("progressPercentage", progressPercentage.toFixed(0));
  }, 1000);
}

function resetCountdown(transactionId) {
  clearInterval(countdowns[transactionId]);
  delete countdowns[transactionId];
  sessionStorage.removeItem(`countdown-${transactionId}`);
  sessionStorage.removeItem("progressPercentage");

  document.getElementById(`countdown-${transactionId}`).textContent = "00:00";
  document.querySelector(".progress-bar-fill").style.width = "0%";
  document.querySelector(".progress-percentage").textContent = "0%";

  Swal.fire({
    icon: "info",
    title: "Time's Up!",
    text: "Your transaction is finished",
    allowOutsideClick: false,
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      showContent("transaction-history");
    }
  });
}

// Fun facts for the waiting page
const funFacts = [
  "The Barangay system has been a part of Philippine society since pre-colonial times.",
  "E-governance initiatives help reduce paper waste and protect the environment.",
  "Digital transformation in local government units improves service delivery by 40%.",
  "Online transaction systems can save citizens an average of 2-3 hours per visit.",
  "The Philippines is one of the fastest-growing digital economies in Southeast Asia.",
];

// Update fun fact every 10 seconds
function updateFunFact() {
  const funFactElement = document.querySelector(".fun-fact");
  let currentIndex = 0;

  // Set initial fun fact
  funFactElement.textContent = funFacts[0];
  funFactElement.style.opacity = "1";

  setInterval(() => {
    // Fade out the current fun fact
    funFactElement.style.opacity = "0";

    setTimeout(() => {
      // Change the fun fact text after fading out
      currentIndex = (currentIndex + 1) % funFacts.length;
      funFactElement.textContent = funFacts[currentIndex];

      // Fade in the new fun fact
      funFactElement.style.opacity = "1";
    }, 500); // Match the duration of the CSS transition
  }, 5000);
  // Set initial fun fact
  funFactElement.textContent = funFacts[0];
}

// Handle submission of transactions
submitButton.addEventListener("click", () => {
  if (selectedTransactions.length > 0) {
    // Fetch transaction status
    fetch("fetch-data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions: selectedTransactions }),
    })
      .then((response) => response.json())
      .then((data) => {
        const allApproved = data.every(
          (transaction) => transaction.status === "approved"
        );

        if (allApproved) {
          remainingRequests += selectedTransactions.length;
          updateRequestStatus();
          extendCountdown();

          fetch("submit-transactions.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transactions: selectedTransactions }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "Transactions submitted successfully!",
                  confirmButtonText: "OK",
                }).then(() => {
                  selectedTransactions = []; // Clear selected transactions
                  cards.forEach((card) => {
                    card.classList.remove("selected");
                  });
                  updateSelectedCount();
                  updateRequestStatus();
                  showContent("waiting-page");
                  startCountdownFromSession(); // Start countdown only if approved
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "An error occurred while submitting transactions.",
                  confirmButtonText: "Try Again",
                });
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error occurred during submission.",
                confirmButtonText: "OK",
              });
            });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Approval Pending",
            text: "One or more selected transactions are not approved yet.",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching transaction statuses:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error fetching transaction statuses.",
          confirmButtonText: "OK",
        });
      });
  }
});

// Set active content and update the navbar button
function setActive(button, contentId) {
  const buttons = document.querySelectorAll(".nav-option");
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
  showContent(contentId);
}

// Show specific content section and set the active navbar button
function showContent(contentId) {
  const contents = document.querySelectorAll(".dash-content-container");
  contents.forEach((content) => (content.style.display = "none"));

  const selectedContent = document.getElementById(contentId);
  if (selectedContent) {
    selectedContent.style.display = "flex";
  }

  // Set the corresponding navbar button to active
  const navButtons = document.querySelectorAll(".nav-option");
  navButtons.forEach((button) => {
    if (button.getAttribute("onclick").includes(contentId)) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  // Close the nav bar if content changes
  closeNavOnNotification();
}

// Function to add status-specific classes to rows
function applyRowStatusStyles() {
  const rows = document.querySelectorAll(".transaction-history-table tbody tr");

  rows.forEach((row) => {
    const statusCell = row.querySelector("td:last-child"); // Get the status cell
    const status = statusCell.textContent.trim().toLowerCase();

    // Apply status classes based on the status text
    if (status === "pending") {
      row.classList.add("pending");
    } else if (status === "approved") {
      row.classList.add("approved");
    } else if (status === "rejected") {
      row.classList.add("rejected");
    }
  });
}

// Function to update the table
function updateTable() {
  // Make an AJAX request to fetch the latest data
  fetch("fetch-data.php") // The endpoint that fetches the data
    .then((response) => response.json()) // Parse the JSON response
    .then((data) => {
      // Get the table body element
      const tableBody = document.getElementById("transaction-table-body");

      // Clear the existing table rows
      tableBody.innerHTML = "";

      // Loop through the data and add rows to the table
      data.forEach((transaction) => {
        const row = document.createElement("tr");

        // Create and append table cells for each field
        row.innerHTML = `
              <td>${transaction.request_id}</td>
              <td>${transaction.transaction_name}</td>
              <td>${transaction.transaction_type}</td>
              <td>${transaction.transaction_details}</td>
              <td>${transaction.time_requested}</td>
              <td>${transaction.date_requested}</td>
              <td>${transaction.status}</td>
            `;

        // Append the row to the table
        tableBody.appendChild(row);
      });

      // Apply status styles after the new rows are added
      applyRowStatusStyles();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Update the table every 5 seconds (5000 ms)
setInterval(updateTable, 5000);

// Initial load of the table content when the page is ready
document.addEventListener("DOMContentLoaded", updateTable);

// Show the modal when the button is clicked
function showModal() {
  var modal = document.getElementById("qrModal");
  modal.style.display = "block";
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  var modal = document.getElementById("qrModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Download QR as PNG
function downloadQR() {
  const modalContent = document.querySelector("#qrModal .modal-container");

  html2canvas(modalContent, { useCORS: true, scale: 5 })
    .then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "QR_ID.png";
      link.click();
      redirectToLogin();
    })
    .catch((error) => console.error("Failed to capture the modal:", error));
}
