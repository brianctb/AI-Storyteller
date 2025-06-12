import { APP_DOMAIN } from "./config.js";

export async function renderNavbar(apicalls, id, username) {
  try {
    const response = await fetch("navbar.html");
    const html = await response.text();
    document.getElementById("navbarContainer").innerHTML = html;
    document.getElementById("apitext").innerHTML = `API calls left: ${apicalls}`;
    document.getElementById("usernametext").innerHTML = ` Hello ${username}!`;
    
    initUsernameModal(id);
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

function initUsernameModal(id) {
  const changeUsernameLink = document.getElementById("changeUsernameLink");
  
  if (changeUsernameLink) {
    changeUsernameLink.addEventListener("click", function(event) {
      event.preventDefault();
      showModal();
    });
    
    const closeModalX = document.getElementById("closeModalX");
    if (closeModalX) {
      closeModalX.addEventListener("click", hideModal);
    }
    
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", hideModal);
    }
    
    const submitBtn = document.getElementById("submitUsernameBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", async function() {
        const newUsername = document.getElementById("newUsername").value;
        console.log("New username submitted:", newUsername);

        if (!newUsername) {
          alert("Please enter a new username.");
          return;
        }
        
        try {
          const response = await fetch(`${APP_DOMAIN}/api/v1/update/${id}`, { 
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: newUsername,
            }),
            credentials: "include",
          });
      
          const userData = await response.json();

          if (response.status === 200) {
            hideModal();
            alert(userData.message || "User updated successfully");
            document.getElementById("usernametext").innerHTML = ` Hello ${newUsername}!`;
          } else {
            alert(userData.message || "User update failed");
          }
        } catch (error) {
          alert("An error occurred while updating user. Please try again.");
        }
        
        document.getElementById("newUsername").value = "";
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener("click", function(event) {
      const modal = document.getElementById("usernameModal");
      if (event.target === modal) {
        hideModal();
      }
    });
  }
}

function showModal() {
  const modal = document.getElementById("usernameModal");
  if (!modal) return;
  
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop fade show";
  document.body.appendChild(backdrop);
  
  modal.style.display = "block";
  modal.classList.add("show");
  document.body.classList.add("modal-open");
  document.body.style.paddingRight = "15px";
  
  console.log("Modal shown");
}

function hideModal() {
  const modal = document.getElementById("usernameModal");
  if (!modal) return;
  
  modal.style.display = "none";
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
  
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }
  
  console.log("Modal hidden");
}
