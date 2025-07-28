function createBody(idName, htmlContent) {
  const body = document.createElement("div");
  body.id = idName;
  body.className = "popup-body";
  // A posição relativa é crucial para posicionar os botões dentro deste container
  body.style.position = 'relative';

  // Verifica se estamos criando o corpo PRINCIPAL do popup
  if (idName === 'popup-body') {
    // Cria e anexa o iframe
    const iframe = document.createElement('iframe');
    iframe.src = "http://localhost:8080";
    iframe.className = "unity-iframe";
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    body.appendChild(iframe);

    // Cria e anexa o container dos botões flutuantes
    const overlayButtonsContainer = document.createElement('div');
    overlayButtonsContainer.className = 'overlay-buttons-container';
    overlayButtonsContainer.innerHTML = `
      <button id="dictionaryButton" class="visible overlay-btn" title="Dicionário"><i class="fa-solid fa-hands"></i></button>
      <button id="microphoneButton" class="overlay-btn" style="display: block;" title="Utilizar Microfone"><i class="fa-solid fa-microphone"></i></button>
    `;
    body.appendChild(overlayButtonsContainer);

  } else {
    // Para todas as outras páginas (dicionário, configurações, etc.), apenas usa o HTML fornecido
    body.innerHTML = htmlContent;
  }

  return body;
}
