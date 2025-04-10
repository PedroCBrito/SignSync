export function infoPage() {
    const popupBody = document.querySelector(".popup-body");
    
    if (popupBody) {
        popupBody.innerHTML = "<p>Texto novo dentro do popup</p>";
        popupBody.style.color = "blue";
    }
}

export function configPage() {
    const popupBody = document.querySelector(".popup-body");
    
    if (popupBody) {
        popupBody.innerHTML = "<p>Texto novo dentro do popup</p>";
        popupBody.style.color = "red";
    }
}

export function questionPage() {
    const popupBody = document.querySelector(".popup-body");
    
    if (popupBody) {
        popupBody.innerHTML = "<p>Texto novo dentro do popup</p>";
        popupBody.style.color = "green";
    }
}