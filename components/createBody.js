function createBody(idName, htmlContent){
    const body = document.createElement("div");
    body.id = idName;
    body.className = "popup-body";
    body.innerHTML = `<div id="permissionStatus"></div>
    <div class="button-container">
      <button id="startRecord">Start Recording</button>
      <button id="stopRecord">Stop Recording</button>
    </div>`

    return body;
}