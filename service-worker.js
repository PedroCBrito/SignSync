let micCaptureWindowId = null;

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.startsWith("http")) {
    console.warn("Cannot inject scripts into chrome:// pages.");
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['./components/injectFontAwesome.js', './components/changePage.js', './components/configFunctions.js', './components/utils.js', './components/drag.js', './components/createBody.js', './components/createHeader.js', './components/createFooter.js', './components/createPopup.js', 'content.js'],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === "service-worker") {
    switch (message.type) {
      case "start-recording-request":
        (async () => {
          try {
            if (message.sourceType === 'mic') {
              const window = await chrome.windows.create({
                url: chrome.runtime.getURL("mic_capture.html"),
                type: "popup",
                width: 1, 
                height: 1,
                top: 9999, 
                left: 9999,
                focused: false,
              });
              micCaptureWindowId = window.id;

            } else {
              const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
              if (!tab || tab.url.startsWith("chrome://")) {
                  alert("Cannot record on system pages.");
                  return;
              }
              const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
              
              const contexts = await chrome.runtime.getContexts({});
              if (!contexts.find((c) => c.contextType === "OFFSCREEN_DOCUMENT")) {
                  await chrome.offscreen.createDocument({ url: "offscreen.html", reasons: ["USER_MEDIA"], justification: "Tab audio processing" });
              }
              
              chrome.runtime.sendMessage({
                  type: "start-recording",
                  target: "offscreen",
                  data: { streamId: streamId }
              });
            }
          } catch (error) {
            alert("Failed to start recording: " + error.message);
          }
        })();
        break;
      
      case "stop-recording":
        chrome.runtime.sendMessage({ type: 'stop-recording', target: 'offscreen' })
          .catch(() => console.log("No offscreen document to stop."));

        if (micCaptureWindowId) {
          chrome.windows.remove(micCaptureWindowId)
            .catch(() => console.log("Mic capture window was already closed."));
          micCaptureWindowId = null;
        }
        break;
    }
  }
  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "transcription-update") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
  }
});
