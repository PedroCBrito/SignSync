// import { infoPage, configPage, questionPage } from "./changePage";
// import { createBody } from "./createBody";

function createIconButton(iconClass, className) {
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
  
  function createCloseButton(popup) {
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.onclick = () => document.getElementById('SignSync-wrapper').remove();
    return closeButton;
  }
  

  function createReturnButton() {
    const returnButton = document.createElement("span");
    returnButton.className = "return-button";
    returnButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    
    returnButton.onclick = () => {
      const shadow = getShadowRoot();
      if (!shadow) return;
      const popupBody = shadow.querySelector('.popup-body');
      popupBody.remove();
      shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
    };
    return returnButton;
  }

  function getShadowRoot() {
    const wrapper = document.getElementById('SignSync-wrapper');
    return wrapper?.shadowRoot || null;
  }

  function createPageHeader(titleText) {
    const headerContainer = document.createElement("div");
    headerContainer.className = "content-page-header";
  
    const returnButton = createReturnButton();
    const title = document.createElement("h2");
    title.textContent = titleText;
  
    headerContainer.appendChild(returnButton);
    headerContainer.appendChild(title);
  
    return headerContainer;
  }
  