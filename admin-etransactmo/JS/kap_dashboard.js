document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu li");
  const sections = document.querySelectorAll(".section");

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menuItems.forEach((i) => i.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      this.classList.add("active");

      const id = this.id;
      if (id === "home-menu") {
        document.getElementById("home-content").classList.add("active");
      } else if (id === "users-menu") {
        document.getElementById("users-content").classList.add("active");
      } else if (id === "requests-menu") {
        document.getElementById("requests-content").classList.add("active");
        fetchPendingRequests();
      } else if (id === "admin-menu") {
        document.getElementById("admin-content").classList.add("active");
        fetchAdminAccounts();
      }
    });
  });

  fetchPendingRequests(); // Optional: load initially if needed
});

function fetchPendingRequests() {
  fetch("../admin/fetch-pending-request.php")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#requests-table tbody");
      tableBody.innerHTML = "";

      if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">No pending requests found.</td></tr>`;
      } else {
        data.forEach((request) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${request.request_id}</td>
            <td>${request.name}</td>
            <td>${request.transaction_name}</td>
            <td>${request.transaction_type}</td>
            <td>${request.transaction_details}</td>
            <td>${request.time_requested}</td>
            <td>${new Date(request.date_requested).toLocaleDateString()}</td>
            <td class="status-${request.request_id}">${request.status}</td>
            <td>
              <button class="approve-btn" onclick="updateRequestStatus(${request.request_id}, 'Approved')">Approve</button>
              <button class="reject-btn" onclick="updateRequestStatus(${request.request_id}, 'Rejected')">Reject</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching pending requests:", error);
    });
}

function updateRequestStatus(requestId, status) {
  fetch("../admin/update-request-status.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request_id: requestId, status: status }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.querySelector(`.status-${requestId}`).textContent = status;
        alert(`Request ${status} successfully.`);
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
    });
}

//ADMIN FETCH
function fetchAdminAccounts() {
  fetch("../admin/fetch_admins.php")
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.querySelector("#admin-table tbody");
      tableBody.innerHTML = "";

      if (!data.length) {
        tableBody.innerHTML = "<tr><td colspan='8'>No admin accounts found.</td></tr>";
        return;
      }

      data.forEach((admin) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${admin.admin_id}</td>
          <td><input value="${admin.name}" id="name-${admin.admin_id}"/></td>
          <td><input value="${admin.username}" id="username-${admin.admin_id}"/></td>
          <td><input value="${admin.password}" id="password-${admin.admin_id}"/></td>
          <td><input value="${admin.mobile_number}" id="mobile-${admin.admin_id}"/></td>
          <td><input value="${admin.position}" id="position-${admin.admin_id}"/></td>
          <td><input value="${admin.district}" id="district-${admin.admin_id}"/></td>
          <td><input value="${admin.purok}" id="purok-${admin.admin_id}"/></td>
          <td>
            <button onclick="updateAdmin(${admin.admin_id})">Save</button>
            <button onclick="deleteAdmin(${admin.admin_id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Failed to fetch admin data", err);
    });
}


function updateAdmin(id) {
  const body = {
    id,
    name: document.getElementById(`name-${id}`).value,
    username: document.getElementById(`username-${id}`).value,
    password: document.getElementById(`password-${id}`).value,
    mobile_number: document.getElementById(`mobile-${id}`).value,
    position: document.getElementById(`position-${id}`).value,
    district: document.getElementById(`district-${id}`).value,
    purok: document.getElementById(`purok-${id}`).value,
  };

  fetch("../admin/update_admin.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Updated successfully");
    });
}

function deleteAdmin(id) {
  if (!confirm("Are you sure you want to delete this admin?")) return;

  fetch("../admin/delete_admin.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Admin deleted.");
      fetchAdminAccounts();
    });
}

