function infoPage() {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.querySelector('.popup-body');
  if (popupBody && popupBody.id !== "infoBody") {
    popupBody.remove();

    const newBody = createBody("infoBody", getInfoContent());
    shadow.querySelector('#SignSync').appendChild(newBody);

    const header = createPageHeader("Sobre Nós");
    newBody.insertBefore(header, newBody.firstChild);
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
    <div style="margin-top: -30px;">
      <p style="text-align: justify !important; text-indent: 2em;">
        Somos um grupo de estudantes apaixonados por tecnologia, unidos pelo propósito de tornar o conteúdo digital mais acessível para a comunidade surda. Acreditamos que a inclusão começa com a comunicação, e por isso desenvolvemos esta extensão com foco na acessibilidade.
      </p>
      <p style="text-align: justify !important; text-indent: 2em;">
        Nosso objetivo é proporcionar uma experiência mais justa e completa para pessoas surdas, traduzindo automaticamente o áudio de vídeos reproduzidos no navegador para a Língua Brasileira de Sinais (Libras).
      </p>
    </div>
  `;
}




function getConfigContent() {
  return `
    <h3>Aparência</h3>

    <div class="appearance-section">
      <!-- Controle de opacidade desabilitado
      <label for="opacityRange">Opacidade</label>
      <div class="opacity-control">
        <input type="range" id="opacityRange" min="0" max="100" value="--popup-opacity">
        <span id="opacityValue">100%</span>
      </div>
      -->

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
    <p>2º Passo: Espere o carregamento do personagem 3D</p>
    <p>3º Passo: Clique no botão "Começar".</p>
    <p>4º Passo: Abra uma página web com um vídeo</p>
    <p>5º Passo: A ferramenta já está pronta para uso</p>
  `;
}
