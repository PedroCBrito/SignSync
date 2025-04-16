import { injectFontAwesome } from './components/injectFontAwesome.js';
import { createPopup } from './components/createPopup.js';
import { enableDrag } from './components/drag.js';

if (!document.getElementById("-wraSignSyncpper")) {
  injectFontAwesome();
  const popup = createPopup();
  document.body.appendChild(popup); 
  enableDrag(popup.shadowRoot.querySelector("#SignSync"));
}

