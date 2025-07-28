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
      target: "service-worker",
      sourceType: 'tab'
    });
  
    startButton.classList.remove("visible");
    setTimeout(() => {
      startButton.style.display = "none";
      stopButton.style.display = "inline-block";
      dictionaryButton.style.display = "none";
      dictionaryButton.classList.remove("visible");
      microphoneButton.style.display = "none";
      setTimeout(() => stopButton.classList.add("visible"), 10);
    }, 300);
  });
 

  stopButton.addEventListener("click", () => {
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: "stop-recording",
        target: "service-worker",
      });
    }, 500);

    stopButton.classList.remove("visible");
        
    const popup = document.getElementById("SignSync-wrapper");
    if (!popup) return;

    const shadow = popup.shadowRoot;
    const transcriptionContent = shadow.getElementById("transcriptionContent");
    
    setTimeout(() => {
      stopButton.style.display = "none";
      startButton.style.display = "block";
      dictionaryButton.classList.add("visible");
      microphoneButton.style.display = "block";
      setTimeout(() => startButton.classList.add("visible"), 10);
      setTimeout(() => transcriptionContent.textContent = "", 100);
    }, 300);
    
  });

  const dictionaryButton = popup.shadowRoot.getElementById("dictionaryButton");
  const microphoneButton = popup.shadowRoot.getElementById("microphoneButton");

  dictionaryButton.addEventListener("click", () => {
    if (!startButton.classList.contains("visible") && startButton.style.display == "none") {
      startButton.classList.add("visible");
      startButton.style.display = "block";
    } else {
      startButton.classList.remove("visible");
      startButton.style.display = "none";
    }
    dictionaryPage();
  });


  microphoneButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "start-recording-request",
      target: "service-worker",
      sourceType: 'mic'
    });
      
    if (!startButton.classList.contains("visible") && startButton.style.display == "none") {
      startButton.classList.add("visible");
      startButton.style.display = "block";
      dictionaryButton.style.display = "block";
      microphoneButton.style.display = "block";
      stopButton.style.display = "none";
    } else {
      startButton.classList.remove("visible");
      startButton.style.display = "none";
      dictionaryButton.classList.remove("visible");
      dictionaryButton.style.display = "none";
      microphoneButton.style.display = "none";
      stopButton.style.display = "inline-block";
    }
  });
}

async function sendWordsToUnitySequentially(words, iframe) {
  const now = Date.now();
  let WORD_EXPIRATION_MS = 5000;
  const sentWords = new Set();
  const wordTimestamps = new Map();

  for (const [word, timestamp] of wordTimestamps.entries()) {
    if (now - timestamp > WORD_EXPIRATION_MS) {
      sentWords.delete(word);
      wordTimestamps.delete(word);
    }
  }

  for (const word of words) {
    if (!word) {
      continue;
    }
    
    if (!sentWords.has(word)) {
      console.log(`Enviando para Unity: ${word}`);
    
      iframe.contentWindow.postMessage(
        { type: "unity-word", word: word },
        "http://localhost:8080"
      );

      sentWords.add(word);
      wordTimestamps.set(word, now);

      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "transcription-update") {
    const popup = document.getElementById("SignSync-wrapper");
    if (!popup) return;

    const shadow = popup.shadowRoot;
    const transcriptionContent = shadow.getElementById("transcriptionContent");
    const iframe = shadow.querySelector("iframe.unity-iframe");

    chrome.storage.local.get({useGloss: false }, (data) => {
      const useGloss = data.useGloss;
      const unityWords = message.dictionaryMessage ? message.word : message.glosa;
      const transcriptionWords = message.dictionaryMessage ? message.word : (useGloss ? message.glosa : message.original);

      if (iframe) {
        transcriptionContent.textContent = transcriptionWords;
        sendWordsToUnitySequentially(unityWords.split(/\s+/), iframe);
      }
    });
  }
});
