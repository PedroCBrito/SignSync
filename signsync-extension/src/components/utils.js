export function createIconButton(iconClass, className) {
    const button = document.createElement("span");
    button.className = className;
    button.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    return button;
  }
  
  export function createCloseButton(popup) {
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.onclick = () => popup.remove();
    return closeButton;
  }
  