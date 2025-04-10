chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.startsWith("http")) {
      console.warn("Não é possível injetar scripts em páginas chrome://");
      return;
    }
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
  