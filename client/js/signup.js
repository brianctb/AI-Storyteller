import { APP_DOMAIN } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const username = document.getElementById("signup-firstname").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      // Make API call to register endpoint
      const response = await fetch(`${APP_DOMAIN}/api/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Registration successful, show success message and redirect to login page
        alert(data.message || "Registration successful! Please login.");
        window.location.href = "../html/login.html";
      } else {
        // Show error message
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  });
});
