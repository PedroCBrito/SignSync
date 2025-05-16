function injectFontAwesome(targetRoot = document.head) {
  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href = chrome.runtime.getURL("public/libraries/fontawesome-free-6.7.2-web/css/all.min.css");
  targetRoot.appendChild(faLink);
}
