import { infoPage, configPage, questionPage } from "./changePage";

export function createIconButton(iconClass, className) {
    const button = document.createElement("span");
    button.className = className;
    button.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

    switch (className) {
      case "config-button":
        button.addEventListener("click", configPage);
        break;
        case "info-button":
        button.addEventListener("click", infoPage);
        break;
        case "question-button":
        button.addEventListener("click", questionPage);
        break;
    }
    
    return button;
  }
  
  export function createCloseButton(popup) {
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.onclick = () => document.getElementById('SignSync-wrapper').remove();
    return closeButton;
  }
  