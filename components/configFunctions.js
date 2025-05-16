// import { getShadowRoot } from "./utils";

function changeOpacity(value) {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const host = shadow.host;
  if (!host) return;

  const alpha = value / 100;

  // Altera a variável CSS no elemento host
  host.style.setProperty('--popup-opacity', alpha);

  const opacityDisplay = shadow.querySelector('#opacityValue');
  if (opacityDisplay) {
    opacityDisplay.textContent = `${value}%`;
  }
}

function changeSize(size) {
  const shadow = getShadowRoot();
  if (!shadow) return;

  const popup = shadow.querySelector('#SignSync');
  if (!popup) return;

  popup.classList.remove('small', 'medium', 'large');
  popup.classList.add(size);
}

function initializeOpacityControl(shadow) {
  const input = shadow.querySelector('#opacityRange');
  const display = shadow.querySelector('#opacityValue');

  if (!input || !display) return;

  const host = shadow.host;
  const styles = getComputedStyle(host);
  const opacityVar = styles.getPropertyValue('--popup-opacity').trim();
  const currentValue = Math.round(parseFloat(opacityVar) * 100);

  input.value = currentValue;
  display.textContent = `${currentValue}%`;
}

function initializeSizeControl(sizeButtons) {
  const shadow = getShadowRoot();
  const popup = shadow.querySelector('#SignSync');
  const currentSize = popup.classList.contains('small')
    ? 'small'
    : popup.classList.contains('large')
    ? 'large'
    : 'medium';

  sizeButtons.forEach(button => {
    if (button.getAttribute('data-size') === currentSize) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

}
