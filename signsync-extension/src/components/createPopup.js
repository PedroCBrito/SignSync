import { createFooter } from './createFooter.js';
import { createHeader } from './createHeader.js';
import { createBody } from './createBody.js';

export function createPopup() {
  const popup = document.createElement("div");
  popup.id = "SignSync";
  popup.className = "SignSync";

  const header = createHeader(popup);
  const body = createBody('popup-body', '');
  const footer = createFooter();

  popup.appendChild(header);
  popup.appendChild(body);
  popup.appendChild(footer);

  return popup;
}
