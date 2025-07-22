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
            <button id="stopRecord" style="display: none;" title="Parar"><i class="fa-solid fa-circle-pause"></i></button>
            <button id="dictionaryButton" class="visible" title="Dicionário"><i class="fa-solid fa-hands"></i></button>
        </div>
        <div class="center-button">
            <button id="startRecord" class="visible" style="display: block;" title="Iniciar"><i class="fa-solid fa-circle-play"></i></button>
            <p id="transcriptionContent"></p>
        </div>
    </div>
    
  `;

  footer.appendChild(transcriptionElement);
  return footer;
}
