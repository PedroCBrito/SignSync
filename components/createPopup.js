// import { createFooter } from './createFooter.js';
// import { createHeader } from './createHeader.js';
// import { createBody } from './createBody.js';
// import { injectFontAwesome } from './injectFontAwesome.js';

function createPopup() {
  const wrapper = document.createElement("div");
  wrapper.id = "SignSync-wrapper";

  const shadow = wrapper.attachShadow({ mode: "open" });

  // Injetar CSS externo e fontes
  injectFontAwesome(shadow);

  const fontURL = chrome.runtime.getURL('public/assets/fonts/Futura/FuturaPTBold.otf');
  const cssURL = chrome.runtime.getURL("public/styles/style.css");

  const style = document.createElement('style');
  style.textContent = `
  @font-face {
    font-family: 'Futura Bold';
    src: url('${fontURL}') format('truetype');
    font-weight: bold;
    font-style: normal;
  }

  #SignSync {
    font-family: 'Futura Bold', sans-serif !important;
  }
`;


  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssURL;

  const popup = document.createElement("div");
  popup.id = "SignSync";
  popup.className = "medium";

  const header = createHeader();
  const body = createBody('popup-body', '');
  const footer = createFooter();

  popup.appendChild(header);
  popup.appendChild(body);
  popup.appendChild(footer);

  shadow.appendChild(style);
  shadow.appendChild(link);
  shadow.appendChild(popup);

  return wrapper;
}
