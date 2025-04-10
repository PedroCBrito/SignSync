export function injectFontAwesome() {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = chrome.runtime.getURL("libraries/fontawesome-free-6.7.2-web/css/all.min.css");
    document.head.appendChild(faLink);
  }
  