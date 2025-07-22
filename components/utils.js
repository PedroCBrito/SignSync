function createIconButton(iconClass, className) {
    const button = document.createElement("span");
    button.className = className;
    button.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

    switch (className) {
      case "config-button":
        button.addEventListener("click", configPage);
        button.title = 'Configurações';
        break;
      case "info-button":
        button.addEventListener("click", infoPage);
        button.title = 'Informações';
      break;
      case "question-button":
        button.addEventListener("click", questionPage);
        button.title = 'Perguntas Frequentes';
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
  

  function createReturnButton(pageId) {
    const returnButton = document.createElement("span");
    returnButton.className = "return-button";
    returnButton.title = 'Voltar';
    returnButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    
    returnButton.onclick = () => {
      showPage(pageId, null, null, null);
    };
    return returnButton;
  }

  function getShadowRoot() {
    const wrapper = document.getElementById('SignSync-wrapper');
    return wrapper?.shadowRoot || null;
  }

  function createPageHeader(pageId, titleText) {
    const headerContainer = document.createElement("div");
    headerContainer.className = "content-page-header";
  
    const returnButton = createReturnButton(pageId);
    const title = document.createElement("h2");
    title.textContent = titleText;
  
    headerContainer.appendChild(returnButton);
    headerContainer.appendChild(title);
  
    return headerContainer;
  }

  function loadScriptsSequentially(scripts, callback) {
    const loadNext = (index) => {
      if (index >= scripts.length) {
        if (callback) callback();
        return;
      }
  
      const script = document.createElement('script');
      script.src = scripts[index];
      script.onload = () => loadNext(index + 1);
      script.onerror = () => console.error(`Failed to load script: ${scripts[index]}`);
      document.head.appendChild(script);
    };
  
    loadNext(0);
  }  
  