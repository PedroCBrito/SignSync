export function createBody(idName, htmlContent){
    const body = document.createElement("div");
    body.id = idName;
    body.className = "popup-body";
    body.innerHTML = htmlContent

    return body;
}