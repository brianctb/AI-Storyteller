import { APP_DOMAIN } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${APP_DOMAIN}/api/v1/admin/data`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const userData = await response.json();
      console.log(userData);
      if (!userData.isAdmin) {
        window.location.href = "./user.html";
      } else {
        displayUserTable(userData.users);
      }
    } else {
      window.location.href = "./login.html";
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "./login.html";
  }

  try {
    const response = await fetch(`${APP_DOMAIN}/api/v1/admin/resource`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const resourceData = await response.json();
      displayResourceTable(resourceData.resources);
    } else {
      console.error("Error fetching resource data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

async function deleteUserById(userId, username) {
  if (confirm(`Are you sure you want to delete user: ${username}?`)) {
    try {
      const response = await fetch(
        `${APP_DOMAIN}/api/v1/admin/delete/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const result = await response.json();
        alert(result.message);
        location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user. Please try again.");
    }
  }
}

function displayUserTable(users) {
  const app = document.getElementById("app");

  const heading = document.createElement("h1");
  heading.textContent = "User Management";
  app.appendChild(heading);

  const table = document.createElement("table");
  table.classList.add("user-table");

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Username", "Email", "Admin Status", "API Calls", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  if (users.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 5;
    emptyCell.classList.add("empty-state");
    emptyCell.textContent = "No users found";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
  } else {
    users.forEach((user) => {
      const row = document.createElement("tr");

      // Username
      const usernameCell = document.createElement("td");
      usernameCell.textContent = user.username;
      row.appendChild(usernameCell);

      // Email
      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      row.appendChild(emailCell);

      // Admin status
      const adminCell = document.createElement("td");
      adminCell.textContent = user.is_admin ? "Yes" : "No";
      row.appendChild(adminCell);

      // API calls
      const apiCallsCell = document.createElement("td");
      apiCallsCell.textContent = user.api_calls;
      row.appendChild(apiCallsCell);

      // Delete
      const actionsCell = document.createElement("td");
      if (!user.is_admin) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => {
          deleteUserById(user.id, user.username);
        });
        actionsCell.appendChild(deleteButton);
      }
      row.appendChild(actionsCell);

      tableBody.appendChild(row);
    });
  }

  table.appendChild(tableBody);
  app.appendChild(table);
}

function displayResourceTable(resources) {
  const app = document.getElementById("app");

  const heading = document.createElement("h1");
  heading.textContent = "Resource Management";
  app.appendChild(heading);

  const table = document.createElement("table");
  table.classList.add("user-table");

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Method", "Endpoint", "Requests"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  if (resources.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 3;
    emptyCell.classList.add("empty-state");
    emptyCell.textContent = "No resources found";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
  } else {
    resources.forEach((resource) => {
      const row = document.createElement("tr");

      // Method
      const methodCell = document.createElement("td");
      methodCell.textContent = resource.method;
      row.appendChild(methodCell);

      // Endpoint
      const endpointCell = document.createElement("td");
      endpointCell.textContent = resource.endpoint;
      row.appendChild(endpointCell);

      // Requests
      const requestsCell = document.createElement("td");
      requestsCell.textContent = resource.requests;
      row.appendChild(requestsCell);

      tableBody.appendChild(row);
    });
  }

  table.appendChild(tableBody);
  app.appendChild(table);
}
