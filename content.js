// import { injectFontAwesome } from './components/injectFontAwesome.js';
// import { createPopup } from './components/createPopup.js';
// import { enableDrag } from './components/drag.js';

if (!document.getElementById("SignSync-wrapper")) {
  injectFontAwesome();
  const popup = createPopup();
  document.body.appendChild(popup); 
  enableDrag(popup.shadowRoot.querySelector("#SignSync"));


  const startButton = popup.shadowRoot.getElementById("startRecord");
  const stopButton = popup.shadowRoot.getElementById("stopRecord");
  const permissionStatus = popup.shadowRoot.getElementById("permissionStatus");

  function showError(message) {
    permissionStatus.textContent = message;
    permissionStatus.style.display = "block";
  }

  function hideError() {
    permissionStatus.style.display = "none";
  }

  async function checkRecordingState() {

    const contexts = await chrome.runtime.getContexts({});
    const offscreenDocument = contexts.find(
      (c) => c.contextType === "OFFSCREEN_DOCUMENT"
    );

    if (
      offscreenDocument &&
      offscreenDocument.documentUrl.endsWith("#recording")
    ) {
      stopButton.style.display = "block";
      setTimeout(() => stopButton.classList.add("visible"), 10);
    } else {
      startButton.style.display = "block";
      setTimeout(() => startButton.classList.add("visible"), 10);
    }
  }

  document.addEventListener("DOMContentLoaded", checkRecordingState);

  startButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "start-recording-request",
      target: "service-worker"
    });

  
    startButton.classList.remove("visible");
    setTimeout(() => {
      startButton.style.display = "none";
      stopButton.style.display = "block";
      setTimeout(() => stopButton.classList.add("visible"), 10);
    }, 300);
  });
 

  stopButton.addEventListener("click", () => {
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: "stop-recording",
        target: "offscreen",
      });
    }, 500);

    stopButton.classList.remove("visible");
    setTimeout(() => {
      stopButton.style.display = "none";
      startButton.style.display = "block";
      setTimeout(() => startButton.classList.add("visible"), 10);
    }, 300);
  });
}


