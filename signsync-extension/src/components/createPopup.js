import { createHeader } from './createHeader.js';

export function createPopup() {
  const popup = document.createElement("div");
  popup.id = "SignSync";

  const header = createHeader(popup);

  const footer = document.createElement("div");
  footer.id = "popup-footer";
  footer.className = "popup-footer";

  popup.appendChild(header);
  popup.appendChild(footer);

  return popup;
}
