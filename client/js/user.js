import { renderNavbar } from "./util.js";
import { APP_DOMAIN } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  let apicalls;
  let userId;
  let username;

  try {
    const response = await fetch(`${APP_DOMAIN}/api/v1/checkUser`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const userData = await response.json();
      userId = userData.id;
      username = userData.username;
    } else {
      window.location.href = "./login.html";
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "./login.html";
  }

  try {
    const response = await fetch(`${APP_DOMAIN}/api/v1/getApiCalls`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const data = await response.json();
      apicalls = data.apiCalls;
    }
  } catch (error) {
    console.error("Error:", error);
  }

  renderNavbar(apicalls, userId, username);
  displayAPIWarningMessage(apicalls);

  document
    .getElementById("storyForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const genre = document.getElementById("genre").value;
      const characterName = document.getElementById("characterName").value;
      const role = document.getElementById("role").value;
      const setting = document.getElementById("setting").value;
      const tone = document.getElementById("tone").value;
      const plotTwist = document.getElementById("plotTwist").checked;

      const prompt = `
        Write a ${tone.toLowerCase()} ${genre.toLowerCase()} story set in a ${setting.toLowerCase()}. The main character is ${characterName}, who plays the role of a ${role.toLowerCase()}. ${plotTwist ? "Add an unexpected plot twist." : ""}
        Can you please return the story in this json format please: { "title": (string, title of the story), "paragraphs": (array of strings for each paragraph of the story) }
      `;

      try {

        showLoadingOverlay();

        const response = await fetch(`${APP_DOMAIN}/api/v1/generate`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate story.");
        }

        const data = await response.json();

        const parsedData = JSON.parse(data.generatedText);
        console.log(parsedData);
        const title = parsedData.title;
        const paragraphs = parsedData.paragraphs;

        displayGeneratedStory(title, paragraphs);
        updateAPICallsLeft();
      } catch (error) {
        alert("Error: " + error.message);
      } finally {
        hideLoadingOverlay();
      }
    });
});

function showLoadingOverlay() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";
}

function hideLoadingOverlay() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "none";
}

function displayGeneratedStory(title, paragraphs) {
  const storyOutput = document.getElementById("storyOutput");
  storyOutput.style.display = "block";

  const storyTitle = document.createElement("h2");
  storyTitle.classList.add("story-title");
  storyTitle.textContent = title;
  storyOutput.appendChild(storyTitle);

  paragraphs.forEach((p) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = p;
    storyOutput.appendChild(paragraph);
  });
}

function updateAPICallsLeft() {
  const apiTextElement = document.getElementById("apitext");
  const apiText = apiTextElement.innerHTML;
  const apiCallsLeft = parseInt(apiText.match(/\d+/)[0], 10) - 1;
  apiTextElement.innerHTML = `API calls left: ${apiCallsLeft}`;
}

function displayAPIWarningMessage(apicalls) {
  if (apicalls >= 0) {
    return;
  }
  const apiWarningContainer = document.getElementById("apiWarningContainer");
  apiWarningContainer.classList.add("alert", "alert-warning", "apiWarningMsg");
  apiWarningContainer.setAttribute("role", "alert");
  apiWarningContainer.innerHTML = `You have 0 API calls left. We'll let you off this time but soon you will have to start paying!`;
}

function validateCharacterName(event) {
  const input = event.target;
  input.value = input.value.replace(/[^A-Za-z\s]/g, "");
}
