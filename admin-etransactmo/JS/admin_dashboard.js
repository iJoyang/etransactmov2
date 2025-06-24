// document.addEventListener("DOMContentLoaded", function () {
//   fetch("user-register.php")
//     .then((response) => response.text())
//     .then((data) => {
//       let container = document.getElementById("qrcode-content");
//       if (container) {
//         container.innerHTML = data;

//         // Dynamically reload JavaScript files
//         loadScript("../JS/user-register.js");
//         loadScript("../JS/user-scanner.js");
//       } else {
//         console.error("Element with ID 'qrcode-content' not found.");
//       }
//     })
//     .catch((error) => console.error("Error loading content:", error));

//   function loadScript(src) {
//     let script = document.createElement("script");
//     script.src = src;
//     script.defer = true;
//     document.body.appendChild(script);
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  // Menu and Content IDs
  const menus = {
    logo: document.getElementById("logo-menu"),
    home: document.getElementById("home-menu"),
    transactions: document.getElementById("transactions-menu"),
    users: document.getElementById("users-menu"),
    userSettings: document.getElementById("usersettings-menu"),
    generalSettings: document.getElementById("generalsettings-menu"),
    qrcode: document.getElementById("qrcode-menu"),
  };
  // console.log([...document.querySelectorAll("*")].map((el) => el.id));

  // console.log(document.getElementById("usersettings-content"));
  // console.log(document.getElementById("generalsettings-content"));

  const contents = {
    logo: document.getElementById("home-content"),
    home: document.getElementById("home-content"),
    transactions: document.getElementById("transactions-content"),
    users: document.getElementById("users-content"),
    userSettings:
      document.getElementById("usersettings-content") ||
      console.warn("usersettings-content not found"),
    generalSettings:
      document.getElementById("generalsettings-content") ||
      console.warn("generalsettings-content not found"),
    qrcode: document.getElementById("qrcode-content"),
  };

  // Hide all sections
  function hideAllSections() {
    Object.values(contents).forEach((content) => {
      if (content) {
        content.classList.remove("active");
      }
    });
    console.log(document.getElementById("transactions-menu"));
    console.log(document.getElementById("transactions-content"));
  }

  // Remove active menu except home when clicking the logo
  function removeActiveMenu(keepHomeActive = false) {
    Object.keys(menus).forEach((menuKey) => {
      if (keepHomeActive && menuKey === "home") return;
      menus[menuKey].classList.remove("active");
    });
  }

  Object.values(menus).forEach((menu) => {
    if (menu) {
      menu.addEventListener("click", () => {
        hideAllSections();
        removeActiveMenu();
        let contentID = menu.id.replace("-menu", "-content");
        let content = document.getElementById(contentID);
        if (content) {
          content.classList.add("active");
        } else {
          console.error(
            `Error: No content section found for ID "${contentID}"`
          );
        }
        menu.classList.add("active");
      });
    } else {
      console.warn(`Warning: Menu element not found in DOM.`);
    }
  });

  // ✅ Handle ?show= parameter
  const urlParams = new URLSearchParams(window.location.search);
  const showContent = urlParams.get("show");

  if (showContent && contents[showContent]) {
    hideAllSections();
    removeActiveMenu();
    contents[showContent].classList.add("active");
    if (menus[showContent]) {
      menus[showContent].classList.add("active");
    }
  }

  // Load dashboard data
  loadDashboardData();
});

// Function to load dashboard data
function loadDashboardData() {
  // Show loading spinner
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.classList.remove("hidden");

  // Fetch resident totals data
  fetch("fetch-resident-totals.php")
    .then((response) => response.json())
    .then((data) => {
      // Update KPI Values with real data
      document.getElementById("totalRegistered").textContent =
        data.totalResidents;

      // Fetch other dashboard data
      fetch("fetch-transaction-requests.php")
        .then((response) => response.json())
        .then((requestsData) => {
          // Count pending requests
          const pendingRequests = requestsData.filter(
            (request) =>
              request.status === "Pending" || request.status === "pending"
          ).length;

          document.getElementById("totalRequests").textContent =
            pendingRequests;

          // For now, set toValidate to 0 or another placeholder
          document.getElementById("toValidate").textContent = "0";

          // Create charts with the data
          createMonthlyTransactionChart(data.monthlyRegistrations);
          createDistrictChart(data.byDistrict);
          createGenderChart(data.byGender);
          createAgeChart(data.byAge);

          // Hide loading spinner
          if (spinner) spinner.classList.add("hidden");
        })
        .catch((error) => {
          console.error("Error fetching requests data:", error);
          if (spinner) spinner.classList.add("hidden");
        });
    })
    .catch((error) => {
      console.error("Error fetching resident data:", error);
      if (spinner) spinner.classList.add("hidden");

      // Use fallback data if fetch fails
      useFallbackData();
    });
}

// Function to use fallback data if API calls fail
function useFallbackData() {
  // Fallback data
  const fallbackData = {
    totalResidents: 200,
    totalRequests: 80,
    toValidate: 40,
    monthlyTransactions: {
      men: [15, 25, 20, 35, 30, 45, 40, 55, 65, 50, 60, 75],
      women: [10, 20, 15, 30, 25, 40, 35, 50, 60, 45, 55, 70],
    },
    byDistrict: {
      "DISTRICT 1": 45,
      "DISTRICT 2": 38,
      "DISTRICT 3": 65,
      "DISTRICT 4": 52,
      "DISTRICT 5": 48,
      "DISTRICT 6": 35,
      "DISTRICT 7": 42,
    },
    byGender: {
      MALE: 180,
      FEMALE: 165,
      OTHER: 25,
    },
    byAge: {
      under18: 55,
      "18to30": 120,
      "31to45": 95,
      "46to60": 65,
      over60: 35,
    },
  };

  // Update KPI Values with fallback data
  document.getElementById("totalRegistered").textContent =
    fallbackData.totalResidents;
  document.getElementById("totalRequests").textContent =
    fallbackData.totalRequests;
  document.getElementById("toValidate").textContent = fallbackData.toValidate;

  // Create charts with fallback data
  createMonthlyTransactionChart({
    men: fallbackData.monthlyTransactions.men,
    women: fallbackData.monthlyTransactions.women,
  });
  createDistrictChart(fallbackData.byDistrict);
  createGenderChart(fallbackData.byGender);
  createAgeChart(fallbackData.byAge);
}

// Function to create Monthly Transaction Chart
function createMonthlyTransactionChart(data) {
  const ctx = document.getElementById("barChart").getContext("2d");

  // Create gradient for men bars
  const menGradient = ctx.createLinearGradient(0, 0, 0, 400);
  menGradient.addColorStop(0, "rgba(54, 162, 235, 0.8)");
  menGradient.addColorStop(1, "rgba(54, 162, 235, 0.2)");

  // Create gradient for women bars
  const womenGradient = ctx.createLinearGradient(0, 0, 0, 400);
  womenGradient.addColorStop(0, "rgba(255, 99, 132, 0.8)");
  womenGradient.addColorStop(1, "rgba(255, 99, 132, 0.2)");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Men",
          data: data.men,
          backgroundColor: menGradient,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7,
        },
        {
          label: "Women",
          data: data.women,
          backgroundColor: womenGradient,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(200, 200, 200, 0.2)",
            drawBorder: false,
          },
          ticks: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 11,
            },
            color: "#666",
          },
          title: {
            display: true,
            text: "Number of Transactions",
            font: {
              family: "'Open Sans', sans-serif",
              size: 13,
              weight: "bold",
            },
            color: "#333",
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 11,
            },
            color: "#666",
          },
          title: {
            display: true,
            text: "Months",
            font: {
              family: "'Open Sans', sans-serif",
              size: 13,
              weight: "bold",
            },
            color: "#333",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 12,
            },
            usePointStyle: true,
            padding: 20,
          },
        },
        title: {
          display: true,
          text: "Monthly Registrations by Gender",
          font: {
            family: "'Open Sans', sans-serif",
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          color: "#333",
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#333",
          bodyColor: "#666",
          bodyFont: {
            family: "'Open Sans', sans-serif",
            size: 12,
          },
          titleFont: {
            family: "'Open Sans', sans-serif",
            size: 14,
            weight: "bold",
          },
          borderColor: "rgba(200, 200, 200, 0.9)",
          borderWidth: 1,
          caretSize: 6,
          cornerRadius: 6,
          padding: 10,
          displayColors: true,
          boxWidth: 10,
          boxHeight: 10,
          boxPadding: 3,
          usePointStyle: true,
        },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
    },
  });
}

// Function to create District Chart
function createDistrictChart(data) {
  const ctx = document.getElementById("districtChart").getContext("2d");

  const labels = Object.keys(data);
  const values = Object.values(data);

  // Create custom colors with better contrast
  const customColors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(76, 175, 80, 0.8)",
  ];

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: customColors,
          borderColor: customColors.map((color) => color.replace("0.8", "1")),
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 12,
            },
            padding: 15,
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        title: {
          display: true,
          text: "Resident Distribution by District",
          font: {
            family: "'Open Sans', sans-serif",
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          color: "#333",
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#333",
          bodyColor: "#666",
          bodyFont: {
            family: "'Open Sans', sans-serif",
            size: 12,
          },
          titleFont: {
            family: "'Open Sans', sans-serif",
            size: 14,
            weight: "bold",
          },
          borderColor: "rgba(200, 200, 200, 0.9)",
          borderWidth: 1,
          caretSize: 6,
          cornerRadius: 6,
          padding: 10,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: "easeOutQuart",
      },
    },
  });
}

// Function to create Gender Chart
function createGenderChart(data) {
  const ctx = document.getElementById("genderChart").getContext("2d");

  const labels = Object.keys(data);
  const values = Object.values(data);

  // Create custom colors with better contrast
  const customColors = [
    "rgba(54, 162, 235, 0.8)", // Blue for Male
    "rgba(255, 99, 132, 0.8)", // Pink for Female
    "rgba(255, 206, 86, 0.8)", // Yellow for Other
  ];

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: customColors,
          borderColor: customColors.map((color) => color.replace("0.8", "1")),
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 3,
          cutout: "65%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 12,
            },
            padding: 15,
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        title: {
          display: true,
          text: "Resident Distribution by Gender",
          font: {
            family: "'Open Sans', sans-serif",
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          color: "#333",
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#333",
          bodyColor: "#666",
          bodyFont: {
            family: "'Open Sans', sans-serif",
            size: 12,
          },
          titleFont: {
            family: "'Open Sans', sans-serif",
            size: 14,
            weight: "bold",
          },
          borderColor: "rgba(200, 200, 200, 0.9)",
          borderWidth: 1,
          caretSize: 6,
          cornerRadius: 6,
          padding: 10,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: "easeOutQuart",
      },
    },
  });
}

// Function to create Age Chart
function createAgeChart(data) {
  const ctx = document.getElementById("ageChart").getContext("2d");

  // Convert age group keys to more readable labels
  const ageLabels = {
    under18: "Under 18",
    "18to30": "18-30",
    "31to45": "31-45",
    "46to60": "46-60",
    over60: "Over 60",
  };

  const labels = Object.keys(data).map((key) => ageLabels[key] || key);
  const values = Object.values(data);

  // Create gradient for bars
  const barGradient = ctx.createLinearGradient(0, 0, 0, 400);
  barGradient.addColorStop(0, "rgba(75, 192, 192, 0.8)");
  barGradient.addColorStop(1, "rgba(75, 192, 192, 0.2)");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Residents by Age Group",
          data: values,
          backgroundColor: barGradient,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 11,
            },
            color: "#666",
          },
        },
        x: {
          beginAtZero: true,
          grid: {
            color: "rgba(200, 200, 200, 0.2)",
            drawBorder: false,
          },
          ticks: {
            font: {
              family: "'Open Sans', sans-serif",
              size: 11,
            },
            color: "#666",
          },
          title: {
            display: true,
            text: "Number of Residents",
            font: {
              family: "'Open Sans', sans-serif",
              size: 13,
              weight: "bold",
            },
            color: "#333",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Resident Distribution by Age Group",
          font: {
            family: "'Open Sans', sans-serif",
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
          color: "#333",
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#333",
          bodyColor: "#666",
          bodyFont: {
            family: "'Open Sans', sans-serif",
            size: 12,
          },
          titleFont: {
            family: "'Open Sans', sans-serif",
            size: 14,
            weight: "bold",
          },
          borderColor: "rgba(200, 200, 200, 0.9)",
          borderWidth: 1,
          caretSize: 6,
          cornerRadius: 6,
          padding: 10,
          displayColors: false,
        },
      },
      animation: {
        delay: function (context) {
          return context.dataIndex * 100;
        },
        duration: 1000,
        easing: "easeOutQuart",
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchRequests = () => {
    fetch("fetch-transaction-requests.php")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.querySelector("#requests-table tbody");
        tableBody.innerHTML = "";

        data.forEach((request) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                      <td>${request.request_id}</td>
                      <td>${request.name}</td>
                      <td>${request.transaction_name}</td>
                      <td>${request.transaction_type}</td>
                      <td>${request.transaction_details}</td>
                      <td>${request.time_requested}</td>
                      <td>${request.date_requested}</td>
                      <td>${request.status}</td>
                      <td>
                      <button class="print-btn" onclick="printRequest(${request.request_id})">Print Now</button>
                      </td>
                  `;
          tableBody.appendChild(row);
        });
      })
      .catch((error) =>
        console.error("Error fetching transaction requests:", error)
      );
  };

  window.printRequest = (requestId) => {
    const printableRow = document.querySelector(
      `tr td:first-child:contains(${requestId})`
    ).parentElement.outerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
            <html>
            <head>
            <script src="../JS/admin_dashboard.js" defer></script>
 
                <title>Print Request</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <h2>Transaction Request Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Transaction Name</th>
                            <th>Type</th>
                            <th>Details</th>
                            <th>Date Requested</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${printableRow}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    printWindow.document.close();
    printWindow.print();
  };

  fetchRequests();
});

document.addEventListener("DOMContentLoaded", () => {
  const districts = {
    "District 1": [
      "Purok Avocado",
      "Purok Durian",
      "Purok Granada",
      "Purok Granada",
      "Purok Labana",
      "Purok Lansones",
      "Purok Marang",
      "Purok Nangka",
      "Purok Pakwan",
      "Purok Pinya",
      "Purok Rambutan",
      "Purok Saging",
      "Purok Santol",
      "Purok Tambis",
      "Purok Chico",
      "Purok Ubas",
    ],
    "District 2": [
      "Purok Acacia",
      "Purok Almasiga",
      "Purok Apitong",
      "Purok Balite",
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
    "District 3": [
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
    "District 4": [
      "Purok Arowana",
      "Purok Balo",
      "Purok Bangus",
      "Purok Bariles",
      "Purok Bolinao",
      "Purok Flowerhorn",
      "Purok Lapu-Lapu",
      "Purok Maya-Maya",
      "Purok Talakitok",
      "Tangigue",
    ],
    "District 5": [
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
    "District 6": [
      "Purok Camel A",
      "Purok Camel B",
      "Purok Cobra",
      "Purok Dragon",
      "Purok Eggplant A",
      "Purok Eggplant B",
      "Purok Kangaroo",
      "Purok Skylark",
      "Purok Panther",
      "Purok Jaguar",
      "Purok Tamaraw",
      "Purok Carabao",
    ],
    "District 7": [
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

  const districtDropdown = document.getElementById("district-dropdown");
  const purokDropdown = document.getElementById("purok-dropdown");
  const usersTableBody = document.querySelector("#users-table tbody");

  // Function to fetch all users
  function fetchAllUsers() {
    fetch("fetch-users.php")
      .then((response) => response.json())
      .then((data) => {
        usersTableBody.innerHTML = ""; // Clear existing rows
        if (data.length > 0) {
          data.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.age}</td>
            <td>${user.gender}</td>
            <td>${user.contact_number || "N/A"}</td>
            <td>${user.address}</td>
             <td>
                <div class='action-buttons'>
                  <button title='View QR ID'
                    class='viewQR-btn'
                    onclick='showModal(this)'
                    data-fullname='${user.full_name}'
                    data-age='${user.age}'
                    data-gender='${user.gender}'
                    data-contact='${user.contact}'
                    data-address='${user.address}'
                    data-qr='${user.qr_code}'>
                    <i class='fa-solid fa-qrcode'></i>
                  </button>
                  <button title='Delete QR ID'
                    class='delete-btn'
                    onclick='confirmDelete(this)'
                    data-id='${user.id}'>
                    <i class='fa-solid fa-trash'></i>
                  </button>
                </div>
              </td>
          `;
            usersTableBody.appendChild(row);
          });
        } else {
          usersTableBody.innerHTML =
            '<tr><td colspan="7">No residents found.</td></tr>';
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        usersTableBody.innerHTML =
          '<tr><td colspan="7">Error fetching residents data.</td></tr>';
      });
  }

  // Populate district dropdown
  Object.keys(districts).forEach((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtDropdown.appendChild(option);
  });

  // Populate purok dropdown based on selected district
  districtDropdown.addEventListener("change", () => {
    const selectedDistrict = districtDropdown.value;
    purokDropdown.innerHTML = '<option value="">-- Select Purok --</option>';
    if (selectedDistrict) {
      districts[selectedDistrict].forEach((purok) => {
        const option = document.createElement("option");
        option.value = purok;
        option.textContent = purok;
        purokDropdown.appendChild(option);
      });
      purokDropdown.disabled = false;
    } else {
      purokDropdown.disabled = true;
      fetchAllUsers();
    }
  });

  purokDropdown.addEventListener("change", () => {
    const selectedDistrict = districtDropdown.value;
    const selectedPurok = purokDropdown.value;

    // ✅ If either dropdown is empty, fetch all users
    if (!selectedDistrict || !selectedPurok) {
      fetchAllUsers();
      return;
    }

    // Otherwise, fetch filtered data
    fetch(
      `fetch-users.php?district=${encodeURIComponent(
        selectedDistrict
      )}&purok=${encodeURIComponent(selectedPurok)}`
    )
      .then((response) => response.json())
      .then((data) => {
        usersTableBody.innerHTML = ""; // Clear existing rows
        if (data.length > 0) {
          data.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${user.id}</td>
              <td>${user.full_name}</td>
              <td>${user.age}</td>
              <td>${user.gender}</td>
              <td>${user.contact_number || "N/A"}</td>
              <td>${user.address}</td>
              <td>
                <div class='action-buttons'>
                  <button title='View QR ID'
                    class='viewQR-btn'
                    onclick='showModal(this)'
                    data-fullname='${user.full_name}'
                    data-age='${user.age}'
                    data-gender='${user.gender}'
                    data-contact='${user.contact}'
                    data-address='${user.address}'
                    data-qr='${user.qr_code}'>
                    <i class='fa-solid fa-qrcode'></i>
                  </button>
                  <button title='Delete QR ID'
                    class='delete-btn'
                    onclick='confirmDelete(this)'
                    data-id='${user.id}'>
                    <i class='fa-solid fa-trash'></i>
                  </button>
                </div>
              </td>
            `;
            usersTableBody.appendChild(row);
          });
        } else {
          usersTableBody.innerHTML =
            '<tr><td colspan="7">No residents found.</td></tr>';
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        usersTableBody.innerHTML =
          '<tr><td colspan="7">Error fetching residents data.</td></tr>';
      });
  });
});

// Disable back and forward buttons
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

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

  console.log((document.getElementById("qrImage").src = qrCode));

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
  const userId = button.getAttribute("data-id");

  let timerInterval;
  let countdown = 5;

  Swal.fire({
    title: "Are you sure you want to delete this data?",
    html: `You can confirm in <b>${countdown}</b> seconds.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes`,
    cancelButtonText: "No",
    allowOutsideClick: false,
    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      confirmBtn.disabled = true;

      timerInterval = setInterval(() => {
        countdown--;
        Swal.getHtmlContainer().querySelector("b").textContent = countdown;

        if (countdown <= 0) {
          clearInterval(timerInterval);
          confirmBtn.disabled = false;
        }
      }, 1000);
    },
    preConfirm: () => {
      return new Promise((resolve) => {
        // Call server to delete data
        fetch(`delete_resident.php?id=${userId}`, {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              Swal.fire("Deleted!", data.message, "success").then(() => {
                location.reload();
              });
            } else {
              Swal.fire("Error!", data.message, "error");
            }
            resolve();
          })
          .catch((err) => {
            Swal.fire("Error!", "An error occurred while deleting.", "error");
            resolve();
          });
      });
    },
    willClose: () => clearInterval(timerInterval),
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const transactionsMenu = document.getElementById("transactions-menu");

  transactionsMenu.addEventListener("click", () => {
    document
      .querySelectorAll(".section")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById("transactions-content").classList.add("active");

    loadApprovedTransactions();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const transactionsMenu = document.getElementById("transactions-menu");
  if (transactionsMenu) {
    transactionsMenu.addEventListener("click", () => {
      showSection("transactions-content");
      loadApprovedTransactions();
    });
  }
});

function showSection(sectionId) {
  document
    .querySelectorAll(".content-section")
    .forEach((sec) => sec.classList.remove("active"));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add("active");
}

function loadApprovedTransactions() {
  const tableBody = document.querySelector(
    "#approved-transactions-table tbody"
  );
  if (!tableBody) return;

  tableBody.innerHTML =
    "<tr><td colspan='9'>Loading approved transactions...</td></tr>";

  fetch("fetch_approved_requests.php")
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";

      if (!data || data.length === 0) {
        tableBody.innerHTML =
          "<tr><td colspan='9'>No approved transactions found.</td></tr>";
        return;
      }

      data.forEach((tx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tx.request_id}</td>
          <td>${tx.name}</td>
          <td>${tx.transaction_name}</td>
          <td>${tx.transaction_type}</td>
          <td>${tx.transaction_details}</td>
          <td>${tx.time_requested}</td>
          <td>${tx.date_requested}</td>
          <td><span class="status-badge status-approved">${tx.status}</span></td>
          <td><button class="print-btn" onclick="printTransaction(${tx.request_id})">Print</button></td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      tableBody.innerHTML =
        "<tr><td colspan='9'>Error loading transactions</td></tr>";
    });
}

function printTransaction(id) {
  // First, update the status to "Finished"
  fetch("../admin/update-request-status.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request_id: id,
      status: "Finished",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // // Then open the print page in a new tab
        // window.open("print_request.php?id=" + id, "_blank");
      } else {
        alert("Failed to update status.");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Something went wrong.");
    });
}

// Ensure it's loaded when section is shown
document.addEventListener("DOMContentLoaded", () => {
  const transactionsMenu = document.getElementById("transactions-menu");
  if (transactionsMenu) {
    transactionsMenu.addEventListener("click", () => {
      document
        .querySelectorAll(".content-section")
        .forEach((sec) => sec.classList.remove("active"));
      document.getElementById("transactions-content").classList.add("active");
      loadApprovedTransactions();
    });
  }
});
