import { APP_DOMAIN } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${APP_DOMAIN}/api/v1/checkUser`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const userData = await response.json();
      if (userData.isAdmin) {
        window.location.href = "./html/admin.html";
      } else {
        window.location.href = "./html/user.html";
      }
    } else {
      window.location.href = "./html/login.html";
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "./html/login.html";
  }
});
