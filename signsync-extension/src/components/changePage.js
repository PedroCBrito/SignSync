import { createBody } from "./createBody";

export function infoPage() {
    const popup = document.getElementById('SignSync');
    const popupBody = document.getElementsByClassName('popup-body')[0];

    if (popupBody && popupBody.id !== "infoBody") {
        popupBody.remove();
        popup.appendChild(createBody("infoBody", getInfoContent()));
    } else {
        popupBody.remove();
        popup.appendChild(createBody('popup-body', ''));
    }
           
}

export function configPage() {
    const popup = document.getElementById('SignSync');
    const popupBody = document.getElementsByClassName('popup-body')[0];

    if (popupBody && popupBody.id !== "configBody") {
        popupBody.remove();
        popup.appendChild(createBody("configBody", getConfigContent()));
    } else {
        popupBody.remove();
        popup.appendChild(createBody('popup-body', ''));
    }
}

export function questionPage() {
    const popup = document.getElementById('SignSync');
    const popupBody = document.getElementsByClassName('popup-body')[0];

    if (popupBody && popupBody.id !== "questionBody") {
        popupBody.remove();
        popup.appendChild(createBody("questionBody", getQuestionContent()));
    } else {
        popupBody.remove();
        popup.appendChild(createBody('popup-body', ''));
    }
}

function getInfoContent() {
    return `
        <h2>Sobre nós</h2>
        <p>Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda.</p>
    `;
}

function getConfigContent() {
    return `
        <h2>Configurações</h2>
    `;
}

function getQuestionContent() {
    return `
        <h2>Ajuda</h2>
    `;
}
