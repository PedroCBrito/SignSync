// import { createBody } from "./createBody";
// import { changeOpacity, changeSize, initializeOpacityControl, initializeSizeControl } from './configFunctions.js';
// import { getShadowRoot, createPageHeader } from "./utils";

function infoPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');
  if (popupBody && popupBody.id !== "infoBody") {
    popupBody.remove();

    const newBody = createBody("infoBody", getInfoContent());
    shadow.querySelector('#SignSync').appendChild(newBody);

    const header = createPageHeader("Sobre Nós");
    newBody.insertBefore(header, newBody.firstChild); // Insere no topo
  } else if (popupBody) {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
  }
}


function configPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');
  if (popupBody && popupBody.id !== "configBody") {
    popupBody.remove();
  

    const newBody = createBody("configBody", getConfigContent());
    shadow.querySelector('#SignSync').appendChild(newBody);

    const header = createPageHeader("Configurações");
    newBody.insertBefore(header, newBody.firstChild);

    // Event listeners
    const opacityRange = newBody.querySelector('#opacityRange');
    const sizeButtons = newBody.querySelectorAll('.size-button');

    if (opacityRange) {
      opacityRange.addEventListener('input', (e) => {
        changeOpacity(e.target.value);
      });
    }

    sizeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const size = button.getAttribute('data-size');
        changeSize(size);
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
      });
    });

    initializeSizeControl(sizeButtons);
    initializeOpacityControl(shadow);
  } else if (popupBody) {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
  }
}

function questionPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');

  if (popupBody && popupBody.id !== "questionBody") {
    popupBody.remove();

    const newBody = createBody("questionBody", getQuestionContent());
    shadow.querySelector('#SignSync').appendChild(newBody);

    const header = createPageHeader("Ajuda");
    newBody.insertBefore(header, newBody.firstChild);

  } else if (popupBody) {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
  }
}


function getInfoContent() {
  const logoUrl = chrome.runtime.getURL("assets/icons/logo_SignSync.png");
  return `
    <p>Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda.</p>
    <img src="${logoUrl}" alt="Logo SignSync" style="width: 100px; height: auto; margin: 0 auto 10px; display: block;">
    `;
}

function getConfigContent() {
  return `
    <h3>Aparência</h3>

    <div class="appearance-section">
      <label for="opacityRange">Opacidade</label>
      <div class="opacity-control">
        <input type="range" id="opacityRange" min="0" max="100" value="--popup-opacity">
        <span id="opacityValue">100%</span>
      </div>

      <h4>Tamanho</h4>
      <div class="size-options">
        <button class="size-button" data-size="small">Pequeno</button>
        <button class="size-button" data-size="medium">Médio</button>
        <button class="size-button" data-size="large">Grande</button>
      </div>
    </div>
  `;
}

function getQuestionContent() {
  return `
    <p>1º Passo: Clique no ícone do SignSync no canto superior direito da barra de endereços do seu navegador.</p>
    <p>2º Passo: Selecione a opção "Configurações".</p>
    <p>3º Passo: Clique no botão "Ajuda".</p>
    <p>4º Passo: Abra uma página web com um vídeo</p>
  `;
}
