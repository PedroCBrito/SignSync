import { createBody } from "./createBody";

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

  if (popupBody && popupBody.id !== "configBody") {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody("configBody", getConfigContent()));
  } else if (popupBody) {
    popupBody.remove();
    shadow.querySelector('#SignSync').appendChild(createBody('popup-body', ''));
  }
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
    <img src="${logoUrl}" alt="Logo SignSync" style="width: 100px; height: auto; margin: 0 auto 10px; display: block;">
    <h2>SOBRE NÓS</h2>
    <p>Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda.</p>
  `;
}

function getConfigContent() {
  return `
    <h2>Configurações</h2>
    <h3>Aparência</h3>
  `;
}

function getQuestionContent() {
  return `
    <h2>AJUDA</h2>
    <p>Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda.</p>
  `;
}
