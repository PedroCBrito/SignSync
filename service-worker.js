chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.startsWith("http")) {
    console.warn("Não é possível injetar scripts em páginas chrome://");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['./components/injectFontAwesome.js', './components/changePage.js', './components/configFunctions.js', './components/utils.js', './components/drag.js', './components/createBody.js', './components/createHeader.js', './components/createFooter.js', './components/createPopup.js', 'content.js'],
  });
});


chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "service-worker") {
    switch (message.type) {
      case "request-recording":
        try {
          const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });

          // Check if we can record this tab
          if (
            !tab ||
            tab.url.startsWith("chrome://") ||
            tab.url.startsWith("chrome-extension://")
          ) {
            chrome.runtime.sendMessage({
              type: "recording-error",
              target: "offscreen",
              error:
                "Cannot record Chrome system pages. Please try on a regular webpage.",
            });
            return;
          }

          // Ensure we have access to the tab
          await chrome.tabs.update(tab.id, {});

          // Get a MediaStream for the active tab
          const streamId = await chrome.tabCapture.getMediaStreamId({
            targetTabId: tab.id,
          });

          // Send the stream ID to the offscreen document to start recording
          chrome.runtime.sendMessage({
            type: "start-recording",
            target: "offscreen",
            data: streamId,
          });

        } catch (error) {
          chrome.runtime.sendMessage({
            type: "recording-error",
            target: "offscreen",
            error: error.message,
          });
        }
        break;

      case "update-icon":
        break;

      case "start-recording-request":
          try {
            const [tab] = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
      
            if (
              !tab ||
              tab.url.startsWith("chrome://") ||
              tab.url.startsWith("chrome-extension://")
            ) {
              alert(
                "Cannot record Chrome system pages. Please try on a regular webpage."
              );
              return;
            }
      
            const contexts = await chrome.runtime.getContexts({});
            const offscreenDocument = contexts.find(
              (c) => c.contextType === "OFFSCREEN_DOCUMENT"
            );
      
            if (!offscreenDocument) {
              await chrome.offscreen.createDocument({
                url: "offscreen.html",
                reasons: ["USER_MEDIA"],
                justification: "Recording from chrome.tabCapture API",
              });
            }
      
            const streamId = await chrome.tabCapture.getMediaStreamId({
              targetTabId: tab.id,
            });
      
            chrome.runtime.sendMessage({
              type: "start-recording",
              target: "offscreen",
              data: streamId,
            });

          } catch (error) {
            alert("Failed to start recording: " + error.message);
          }
          break;  
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "transcription-update") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, message);
        }
      });
    }
  });


});