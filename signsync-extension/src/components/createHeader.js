import { createIconButton, createCloseButton } from './utils.js';

export function createHeader() {
  const header = document.createElement("div");
  header.id = "popup-header";
  header.className = "popup-header";

  const left = document.createElement("div");
  left.className = "left-container";
  left.appendChild(createIconButton("fa-gears", "config-button"));
  left.appendChild(createIconButton("fa-circle-question", "question-button"));

  const center = document.createElement("div");
  center.className = "center-container";
  const logoUrl = chrome.runtime.getURL("assets/icons/mini_logo.png");

  // Corrigido: criando elemento de imagem
  const logoImg = document.createElement("img");
  logoImg.src = logoUrl;
  logoImg.alt = "Logo SignSync";
  logoImg.className = "logo-header-image";
  center.appendChild(logoImg);

  const right = document.createElement("div");
  right.className = "right-container";
  right.appendChild(createIconButton("fa-circle-info", "info-button"));
  right.appendChild(createCloseButton());

  header.appendChild(left);
  header.appendChild(center);
  header.appendChild(right);

  return header;
}
