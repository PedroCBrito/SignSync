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
let lastWordSent = null;
let resetTimer;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "transcription-update") {
    const popup = document.getElementById("SignSync-wrapper");
    if (!popup) return;

    const shadow = popup.shadowRoot;
    const transcriptionEl = shadow.getElementById("transcription-text");
    if (transcriptionEl) {
      transcriptionEl.textContent = message.word;
    }

    const iframe = shadow.querySelector("iframe.unity-iframe");

    if (iframe && message.word !== lastWordSent) {
      iframe.contentWindow.postMessage(
        { type: "unity-word", word: message.word },
        "http://localhost:8080"
      );
      lastWordSent = message.word;

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        lastWordSent = null;
      }, 2000);
    }
  }
});
