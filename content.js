if (!document.getElementById("SignSync")) {
  const popup = document.createElement("div");
  popup.id = "SignSync";


  const closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = () => popup.remove();

  const infoButton = document.createElement("span");
  infoButton.className = "info-button";
  infoButton.innerHTML = "&times;";

  const configButton = document.createElement("span");
  configButton.className = "config-button";

  const configImg = document.createElement("img");
  configImg.src = chrome.runtime.getURL("icons/icon_config.png");
  configImg.alt = "Config";
  configImg.className = "config-icon";

  configButton.appendChild(configImg);


  const popup_header = document.createElement("div");
  popup_header.id = "popup-header";
  popup_header.className = "popup-header";

  // Create left, center, right containers
  const leftContainer = document.createElement("div");
  leftContainer.className = "left-container";
  leftContainer.appendChild(configButton);

  const centerContainer = document.createElement("div");
  centerContainer.className = "center-container";
  centerContainer.textContent = "SignSync";

  const rightContainer = document.createElement("div");
  rightContainer.className = "right-container";
  rightContainer.appendChild(infoButton);

  // Optional: you can also put the closeButton in the rightContainer
  rightContainer.appendChild(closeButton);

  // Append to popup header
  popup_header.appendChild(leftContainer);
  popup_header.appendChild(centerContainer);
  popup_header.appendChild(rightContainer);



  popup.appendChild(popup_header);

  document.body.appendChild(popup);

  // Drag logic
  popup.onmousedown = function (event) {
    if (event.target === closeButton) return;

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

    popup.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      popup.onmouseup = null;
    };
  };

  popup.ondragstart = function () {
    return false;
  };
}
