function infoPage() {
  showPage("infoBody", getInfoContent, "Sobre Nós");
}

function configPage() {
  showPage("configBody", getConfigContent, "Configurações", setupConfigPage);
}

function questionPage() {
  showPage("questionBody", getQuestionContent, "Ajuda");
}

function dictionaryPage() {
  showPage("dictionaryBody", getDictionaryContent, "Dicionário", setupDictionaryPage);
}

function showPage(pageId, getContent, headerTitle, setupFn) {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popupBody = shadow.getElementById(pageId);  
  if (!popupBody) {
    shadow.getElementById('popup-body').style.display = 'none';
    shadow.getElementById('startRecord').style.display = 'none';
    shadow.getElementById('startRecord').classList.remove('visible');
    // Remove all elements with class 'popup-body' and id different from 'popup-body'
    const popupBodies = shadow.querySelectorAll('.popup-body');
    popupBodies.forEach(el => {
      if (el.id !== 'popup-body') el.remove();
    });
    
    const newBody = createBody(pageId, getContent());
    shadow.querySelector('#SignSync').appendChild(newBody);

    const header = createPageHeader(pageId, headerTitle);
    newBody.insertBefore(header, newBody.firstChild);

    if (typeof setupFn === 'function') setupFn(newBody, shadow);
  } else {
    popupBody.remove();
    shadow.getElementById('popup-body').style.display = 'flex';
    shadow.getElementById('startRecord').style.display = 'block';
    shadow.getElementById('startRecord').classList.add('visible');
  }
}


function setupConfigPage(newBody, shadow) {
  const opacityRange = newBody.querySelector('#opacityRange');
  const sizeButtons = newBody.querySelectorAll('.size-button');
  const transcriptionButtons = newBody.querySelectorAll('.transcription-button');

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

  transcriptionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const format = button.getAttribute('data-format');
      const useGloss = (format === 'glosa');

      chrome.storage.local.set({ useGloss: useGloss });

      transcriptionButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });

  initializeSizeControl(sizeButtons);
  initializeOpacityControl(shadow);
  initialTranscriptionFormat(transcriptionButtons);
}

function initialTranscriptionFormat(transcriptionButtons) {
    chrome.storage.local.get({ useGloss: false }, (data) => {
      const formatToSelect = data.useGloss ? 'glosa' : 'portuguese';
      transcriptionButtons.forEach(button => {
        const format = button.getAttribute('data-format');
        if (format === formatToSelect) {
          button.classList.add('selected');
        } else {
          button.classList.remove('selected');
        }
      });
  });
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
    <div class="appearance-section">
    <!-- 
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

      <h4>Formato da transcrição</h4>
      <div class="transcription-options">
        <button class="transcription-button" data-format="portuguese">Português</button>
        <button class="transcription-button" data-format="glosa">Glosa</button>
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

function getDictionaryContent() {
  return `
    <div style="width:100%; padding:10px;" id="dictionaryBody">
      <input type="text" id="dictionarySearch" placeholder="Buscar palavra..." style="width: 100%; margin-bottom: 10px;" />
      <ul id="dictionaryList" style="max-height: 200px; overflow-y: auto; padding-left: 0;"></ul>
    </div>
  `;
}

async function setupDictionaryPage(newBody) {
  const shadow = getShadowRoot();
  const listEl = newBody.querySelector('#dictionaryList');
  const searchEl = newBody.querySelector('#dictionarySearch');
  let words = [];

  try {
    const res = await fetch(chrome.runtime.getURL('public/dictionary.json'));
    words = await res.json();
  } catch (e) {
    listEl.innerHTML = '<li>Erro ao carregar o dicionário.</li>';
    return;
  }

  function renderList(filter = '') {
    const filtered = words.filter(word => word.toLowerCase().includes(filter.toLowerCase()));
    listEl.innerHTML = filtered.length
      ? filtered.map(word => `<li class="dictionary-word" style="cursor:pointer; list-style:none; padding:4px 0;">${word}</li>`).join('')
      : '<li>Nenhuma palavra encontrada.</li>';
  }

  renderList();

  searchEl.addEventListener('input', e => {
    renderList(e.target.value);
  });

  listEl.addEventListener('click', e => {
    if (e.target.classList.contains('dictionary-word')) {
      chrome.runtime.sendMessage({
        type: "transcription-update",
        word: e.target.textContent,
        dictionaryMessage: true,
      });
    }
    shadow.getElementById('dictionaryBody').remove();
    shadow.getElementById('popup-body').style.display = 'flex';
    setTimeout(() => {
      shadow.getElementById("startRecord").style.display = "block";
      shadow.getElementById("transcriptionContent").textContent = '';
    }, 2000);
  });
}