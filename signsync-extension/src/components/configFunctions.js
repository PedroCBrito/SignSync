export function changeOpacity(value) {
    const shadow = getShadowRoot();
    if (!shadow) return;
  
    const popupBody = shadow.querySelector('.popup-body');
    if (!popupBody) return;
  
    const alpha = value / 100;
  
    popupBody.style.backgroundColor = `rgba(245, 242, 236, ${alpha})`;
  
    const opacityDisplay = shadow.querySelector('#opacityValue');
    if (opacityDisplay) {
      opacityDisplay.textContent = `${value}%`;
    }
  }
  
  

export function changeSize(size) {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popup = shadow.querySelector('#SignSync');
  if (!popup) return;

  popup.classList.remove('small', 'medium', 'large');
  popup.classList.add(size);
}

function getShadowRoot() {
  const wrapper = document.getElementById('SignSync-wrapper');
  return wrapper?.shadowRoot || null;
}