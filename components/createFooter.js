function createFooter(){
    const footer = document.createElement("div");
    footer.id = "popup-footer";
    footer.className = "popup-footer";

    const transcriptionElement = document.createElement("p");
    transcriptionElement.id = "transcription-text";
    transcriptionElement.className = "transcription-text";
    transcriptionElement.textContent = "Default Transcription";

    footer.appendChild(transcriptionElement);

    return footer;
}
