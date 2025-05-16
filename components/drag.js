function enableDrag(popup) {
    const header = popup.querySelector("#popup-header");
  
    header.onmousedown = function (event) {
      event.preventDefault();
  
      const shiftX = event.clientX - popup.getBoundingClientRect().left;
      const shiftY = event.clientY - popup.getBoundingClientRect().top;
  
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
  
    header.ondragstart = () => false;
  }
  