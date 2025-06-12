import { APP_DOMAIN } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to login form
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    console.log(email, password);

    try {
      // Make API call to login endpoint
      const response = await fetch(`${APP_DOMAIN}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Login successful, redirect based on user role
        if (data.isAdmin) {
          window.location.href = "admin.html";
        } else {
          window.location.href = "user.html";
        }
      } else {
        // Show error message
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login. Please try again.");
    }
  });
});
