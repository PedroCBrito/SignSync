import { injectFontAwesome } from './components/injectFontAwesome.js';
import { createPopup } from './components/createPopup.js';
import { enableDrag } from './components/drag.js';

if (!document.getElementById("SignSync-wrapper")) {
  injectFontAwesome();
  const popup = createPopup();
  document.body.appendChild(popup); // `popup` é o wrapper
  enableDrag(popup.shadowRoot.querySelector("#SignSync")); // se quiser aplicar drag no popup interno
}

