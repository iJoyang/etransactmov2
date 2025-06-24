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
let totalDuration = 0;
let countdownInterval = null; // Store the interval ID for countdown
let countdownEnd = sessionStorage.getItem("countdownEnd") || 0; // Store the countdown end time
let savedProgressPercentage =
  sessionStorage.getItem("progressPercentage") || "0";
let savedProgressBarWidth = sessionStorage.getItem("progressBarWidth") || "0%";
let cardSelectionState = {}; // Track the state of each card (selected or not)
// Variables to track the number of finished and remaining requests
// Initialize requests from sessionStorage or set to 0 if not present

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

// Add hover event listener to both icon and closeBtn
const addHoverEffect = () => {
  settingsNav.classList.add("borders-white");
  closeBtn.classList.add("borders-white");
  icon.classList.add("font-white");
};

const removeHoverEffect = () => {
  settingsNav.classList.remove("borders-white");
  closeBtn.classList.remove("borders-white");
  icon.classList.remove("font-white");
};

// Add the event listeners to both icon and closeBtn
icon.addEventListener("mouseenter", addHoverEffect);
icon.addEventListener("mouseleave", removeHoverEffect);
closeBtn.addEventListener("mouseenter", addHoverEffect);
closeBtn.addEventListener("mouseleave", removeHoverEffect);

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
    const durationInSeconds = parseInt(card.getAttribute("data-duration"));
    const durationInMinutes = durationInSeconds / 60;

    if (card.classList.contains("selected")) {
      // If card is already selected, deselect it
      card.classList.remove("selected");

      // Remove transactionId from the selectedTransactions array
      selectedTransactions = selectedTransactions.filter(
        (id) => id !== transactionId
      );
      totalDuration -= durationInMinutes;
    } else {
      // If card is not selected, select it
      card.classList.add("selected");

      // Add transactionId to the selectedTransactions array only if it's not already there
      if (!selectedTransactions.includes(transactionId)) {
        selectedTransactions.push(transactionId);
        totalDuration += durationInMinutes;
      }
    }
    updateSelectedCount();
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

let submittedRequestIds = [];

// Handle submission of transactions
submitButton.addEventListener("click", () => {
  if (selectedTransactions.length > 0) {
    fetch("submit-transactions.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions: selectedTransactions }),
    })
      .then((response) => response.text())
      .then((text) => {
        return JSON.parse(text); // Try to parse manually
      })
      .then((data) => {
        if (data.status === "success") {
          // fetchAllTransactionStatuses(data.request_id);
          Swal.fire({
            icon: "warning",
            title: "Pending",
            text: "Transactions are still Pending, please wait for approval.",
            confirmButtonText: "OK",
          }).then(() => {
            selectedTransactions = []; // Clear selected transactions
            cards.forEach((card) => {
              card.classList.remove("selected");
            });
            updateSelectedCount();
            updateRequestStatus();
            showContent("transaction-history");
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
  }
});

// Set active content and update the navbar button

function setActive(button, contentId) {
  const buttons = document.querySelectorAll(".nav-option");
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
  showContent(contentId);

  // Store the last active content in localStorage
  localStorage.setItem("lastActiveContent", contentId);
}

// Show specific content section and set the active navbar button
function showContent(contentId) {
  const contents = document.querySelectorAll(".dash-content-container");
  contents.forEach((content) => (content.style.display = "none"));

  const selectedContent = document.getElementById(contentId);
  if (selectedContent) {
    selectedContent.style.display = "flex";

    // Save the last visible content in localStorage
    localStorage.setItem("lastActiveContent", contentId);
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

document.addEventListener("DOMContentLoaded", () => {
  const lastContentId = localStorage.getItem("lastActiveContent");

  if (lastContentId) {
    showContent(lastContentId);
  } else {
    showContent("homeContent"); // Replace "homeContent" with your actual default content ID
  }
});

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

      if (data.length > 0) {
        // Set last known transaction ID to the first (most recent) item
        lastKnownTransactionId = parseInt(data[0].request_id);
      }
      // Loop through the data and add rows to the table
      data.forEach((transaction) => {
        const row = document.createElement("tr");

        // Create and append table cells for each field
        row.innerHTML = `
              <td>${transaction.request_id}</td>
              <td>${transaction.name}</td>
              <td>${transaction.transaction_name}</td>
              <td>${transaction.transaction_type}</td>
              <td>${transaction.transaction_details}</td>
              <td>${transaction.time_requested} | ${transaction.date_requested}</td>
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

function checkIfTransactionUpdated() {
  fetch("check-transactions-status.php")
    .then((res) => res.json())
    .then((data) => {
      if (parseInt(data.latest_id) > lastKnownTransactionId) {
        updateTable();
      }
    })
    .catch((error) => console.error("Check update error:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  updateTable(); // Initial fetch
  setInterval(checkIfTransactionUpdated, 5000); // Poll for new data
});

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
    })
    .catch((error) => console.error("Failed to capture the modal:", error));
}

// WAITING PAGE

let lastProcessingTime = null;
let lastFinishedTime = null;

function checkIfQueueUpdated() {
  fetch("check-queue-status.php")
    .then((res) => res.json())
    .then((data) => {
      if (
        data.latest_processing !== lastProcessingTime ||
        data.latest_finished !== lastFinishedTime
      ) {
        lastProcessingTime = data.latest_processing;
        lastFinishedTime = data.latest_finished;
        fetchQueue(); // Refresh queue
        fetchFinished(); // Refresh finished transactions
        fetchPendingCount(); // Refresh pending count
      }
    });
}

function fetchQueue() {
  fetch("get-pending-queue.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("queue-body");
      tbody.innerHTML = "";

      data.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><span class='user-icon'><i class='fas fa-user'></i>${
            index + 1
          }</span></td>
          <td>${row.request_id}</td>
          <td>${row.name}</td>
          <td>${row.transaction_name}</td>
        `;

        tr.classList.add("fade-in");
        if (index === 0) setTimeout(() => tr.classList.add("serving-now"), 100);
        tbody.appendChild(tr);
      });
    });
}

function fetchFinished() {
  fetch("get-finished-transactions.php")
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.getElementById("finished-transactions-body");
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="4">No finished transactions</td></tr>';
        return;
      }

      data.forEach((transaction) => {
        const row = `
          <tr>
            <td>${transaction.request_id}</td>
            <td>${transaction.name}</td>
            <td>${transaction.transaction_name}</td>
            <td>${transaction.elapsed_time} min</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    });
}

function fetchPendingCount() {
  fetch("get-pending-count.php")
    .then((res) => res.text())
    .then((count) => {
      document.getElementById("pending-count").innerText = count;
    })
    .catch(() => {
      document.getElementById("pending-count").innerText = "Error";
    });
}

// Initial fetch on load
document.addEventListener("DOMContentLoaded", function () {
  fetchQueue();
  fetchFinished();
  fetchPendingCount();
  checkIfQueueUpdated();
});

// Poll every 10 seconds
setInterval(checkIfQueueUpdated, 10000);

const categoryLabels = [];
const categoryData = [];

const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { width, height } = chart;
    const ctx = chart.ctx;
    const total = chart.options.plugins.centerText?.total || 0;

    ctx.save();
    const totalFontSize = 50;
    ctx.font = `bold ${totalFontSize}px sans-serif`;
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toString(), width / 2, height / 2);

    const labelFontSize = totalFontSize / 2;
    ctx.font = `${labelFontSize}px sans-serif`;
    ctx.fillText("TOTAL", width / 2, height / 2 + 50);
    ctx.restore();
  },
};

function createDoughnutChart(
  canvasId,
  legendCol1Id,
  legendCol2Id,
  chartTitle,
  fetchUrl,
  chartType = "doughnut" // default to doughnut
) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  const plugins = chartType === "doughnut" ? [centerTextPlugin] : [];

  // Custom background color logic
  let backgroundColor = [];
  if (canvasId === "myDoughnutChart1") {
    backgroundColor = ["#8D6E63", "#A1887F", "#5D4037", "#3E2723", "#D7CCC8"];
  } else if (canvasId === "myDoughnutChart2") {
    backgroundColor = ["#4CAF50", "#81C784", "#2E7D32", "#66BB6A", "#1B5E20"];
  } else if (chartType === "pie") {
    backgroundColor = ["#FFC107", "#4CAF50", "#2196F3"]; // Yellow, Green, Blue
  } else {
    backgroundColor = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"];
  }

  const chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: backgroundColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      cutout: chartType === "doughnut" ? "70%" : 0,
      hoverOffset: 20,
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          font: { size: 20, weight: "bold" },
          padding: { top: 10, bottom: 20 },
        },
        legend: { display: false },
        ...(chartType === "doughnut" && {
          centerText: { total: 0 },
        }),
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
    },
    plugins: plugins,
  });

  function updateChartData() {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then(({ labels, data, total }) => {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        // Assign custom colors based on chart ID
        if (canvasId === "myDoughnutChart1") {
          // Shades of brown
          chart.data.datasets[0].backgroundColor = [
            "#4B2E2B", // Dark Roast Espresso
            "#5C4033", // Mocha Brown
            "#6F4E37", // Classic Coffee
            "#7B5E57", // Cafe au Lait
            "#8B6B5C", // Warm Latte
            "#9C7D63", // Caramel Brew
            "#AD8B75", // Cappuccino
            "#C1A192", // Coffee Cream
            "#D3B8A6", // Light Roast
            "#E6D3C5", // Latte Foam
            "#F3E8DD", // Coffee Cream Top
          ].slice(0, labels.length);
        } else if (canvasId === "myDoughnutChart2") {
          // Shades of green
          chart.data.datasets[0].backgroundColor = [
            "#1B5E20",
            "#2E7D32",
            "#388E3C",
            "#43A047",
            "#4CAF50",
            "#66BB6A",
            "#81C784",
            "#A5D6A7",
            "#C8E6C9",
            "#E8F5E9",
            "#AED581",
          ].slice(0, labels.length);
        } else if (chartType === "pie") {
          // Yellow = Pending, Green = Approved, Blue = Finished
          chart.data.datasets[0].backgroundColor = [
            "#FFC107",
            "#4CAF50",
            "#2196F3",
          ].slice(0, labels.length);
        } else {
          // Fallback colors
          chart.data.datasets[0].backgroundColor = [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#FF5722",
            "#9C27B0",
            "#00BCD4",
            "#E91E63",
            "#8BC34A",
            "#607D8B",
            "#795548",
            "#3F51B5",
          ].slice(0, labels.length);
        }

        if (chartType === "doughnut") {
          chart.options.plugins.centerText.total = total;
        }
        chart.update();
        generateCustomLegend(chart, legendCol1Id, legendCol2Id);
      })
      .catch((err) => console.error("Failed to fetch chart data:", err));
  }

  updateChartData();
}

function generateCustomLegend(chart, col1Id, col2Id) {
  const col1 = document.getElementById(col1Id);
  const col2 = document.getElementById(col2Id);
  col1.innerHTML = "";
  col2.innerHTML = "";

  chart.data.labels.forEach((label, index) => {
    const color = chart.data.datasets[0].backgroundColor[index];
    const item = `
      <div class="custom-legend-item">
        <span class="legend-box" style="background:${color}"></span>
        ${label}
      </div>
    `;
    if (index < 6) {
      col1.innerHTML += item;
    } else {
      col2.innerHTML += item;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createDoughnutChart(
    "myDoughnutChart1",
    "legend-col1-1",
    "legend-col2-1",
    "",
    "fetch-pending-transactions.php",
    "doughnut"
  );
  createDoughnutChart(
    "myDoughnutChart2",
    "legend-col1-2",
    "legend-col2-2",
    "",
    "fetch-approved-transactions.php",
    "doughnut"
  );
  createDoughnutChart(
    "myDoughnutChart3",
    "legend-col1-3",
    "legend-col2-3",
    "",
    "fetch-mytransactions-percentage.php",
    "pie"
  );
});

function filterTable() {
  const input = document.getElementById("transactionSearch");
  const filter = input.value.toLowerCase();
  const table = document.getElementById("transaction-table-body");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let matchFound = false;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell && cell.innerText.toLowerCase().includes(filter)) {
        matchFound = true;
        break;
      }
    }

    rows[i].style.display = matchFound ? "" : "none";
  }
}
