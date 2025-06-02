function createFooter() {
  const footer = document.createElement("div");
  footer.id = "popup-footer";
  footer.className = "popup-footer";

  const transcriptionElement = document.createElement("div");
  transcriptionElement.id = "transcription-text";
  transcriptionElement.className = "transcription-text";
  transcriptionElement.innerHTML = `
    <div class="button-row">
        <div class="left-button">
            <button id="stopRecord" style="display: none;">Parar</button>
        </div>
        <div class="center-button">
            <button id="startRecord" class="visible">Começar</button>
            <p id="transcriptionContent"></p>
        </div>
    </div>
    
  `;

  footer.appendChild(transcriptionElement);
  return footer;
}
