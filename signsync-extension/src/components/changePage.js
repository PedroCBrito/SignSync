import { createBody } from "./createBody";
import { changeOpacity, changeSize } from './configFunctions.js';

// Utilitário para acessar o shadow root corretamente
function getShadowRoot() {
  const wrapper = document.getElementById('SignSync-wrapper');
  return wrapper?.shadowRoot || null;
}

export function infoPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');

  if (popupBody && popupBody.id !== "infoBody") {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody("infoBody", getInfoContent()));
  } else if (popupBody) {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
  }
}

export function configPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');
  if (popupBody) {
    popupBody.remove();
  }

  const newBody = createBody("configBody", getConfigContent());
  shadow.querySelector('#SignSync').appendChild(newBody);

  // Adiciona os event listeners manualmente
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
    });
  });
}


export function questionPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');

  if (popupBody && popupBody.id !== "questionBody") {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody("questionBody", getQuestionContent()));
  } else if (popupBody) {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
  }
}

function getInfoContent() {
  const logoUrl = chrome.runtime.getURL("assets/icons/logo_SignSync.png");
  return `
    <h2>Sobre Nós</h2>
    <p>Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda.</p>
    <img src="${logoUrl}" alt="Logo SignSync" style="width: 100px; height: auto; margin: 0 auto 10px; display: block;">
    `;
}

function getConfigContent() {
  return `
    <h2>Configurações</h2>
    <h3>Aparência</h3>

    <div class="appearance-section">
      <label for="opacityRange">Opacidade</label>
      <div class="opacity-control">
        <input type="range" id="opacityRange" min="0" max="100" value="100">
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
    <h2>Ajuda</h2>
    <p>Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda.</p>
  `;
}
