const faLink = document.createElement("link");
faLink.rel = "stylesheet";
faLink.href = chrome.runtime.getURL("libraries/fontawesome-free-6.7.2-web/css/all.min.css");
document.head.appendChild(faLink);


if (!document.getElementById("SignSync")) {
  const popup = document.createElement("div");
  popup.id = "SignSync";


  const closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeButton.onclick = () => popup.remove();

  const infoButton = document.createElement("span");
  infoButton.className = "info-button";
  infoButton.innerHTML = '<i class="fa-solid fa-circle-info"></i>';

  const configButton = document.createElement("span");
  configButton.className = "config-button";
  configButton.innerHTML = '<i class="fa-solid fa-gears"></i>';


  const popup_header = document.createElement("div");
  popup_header.id = "popup-header";
  popup_header.className = "popup-header";

  const leftContainer = document.createElement("div");
  leftContainer.className = "left-container";
  leftContainer.appendChild(configButton);

  const centerContainer = document.createElement("div");
  centerContainer.className = "center-container";
  centerContainer.textContent = "SignSync";

  const rightContainer = document.createElement("div");
  rightContainer.className = "right-container";
  rightContainer.appendChild(infoButton);

  rightContainer.appendChild(closeButton);

  popup_header.appendChild(leftContainer);
  popup_header.appendChild(centerContainer);
  popup_header.appendChild(rightContainer);

  const popup_footer = document.createElement("div");
  popup_footer.id = "popup-footer";
  popup_footer.className = "popup-footer";

  popup.appendChild(popup_header);
  popup.appendChild(popup_footer);

  document.body.appendChild(popup);

  // Drag logic apenas no header
  popup_header.onmousedown = function (event) {
    event.preventDefault(); // evitar seleção de texto

    let shiftX = event.clientX - popup.getBoundingClientRect().left;
    let shiftY = event.clientY - popup.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      popup.style.left = pageX - shiftX + 'px';
      popup.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  };

  popup_header.ondragstart = function () {
    return false;
  };

}
