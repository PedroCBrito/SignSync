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

      case "recording-stopped":
        chrome.action.setIcon({ path: "icons/not-recording.png" });
        break;

      case "update-icon":
        break;
    }
  }
});
