function createBody(idName, htmlContent){
    const body = document.createElement("div");
    body.id = idName;
    body.className = "popup-body";
    body.innerHTML = htmlContent? htmlContent : `

    <iframe src="http://localhost:8080" class="unity-iframe"></iframe>

    <div class="button-container">
      <button id="startRecord">Começar</button>
      <button id="stopRecord">Parar</button>
    </div>`

    return body;
}