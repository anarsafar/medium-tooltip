const svgs = `
  <div class="tooltip__icon">
   <svg  class="tooltip__icon__svg" width="25" height="25" viewBox="0 0 25 25"><path d="M13.7 15.96l5.2-9.38-4.72-2.62-5.2 9.38 4.72 2.62zm-.5.89l-1.3 2.37-1.26.54-.7 1.26-3.8-.86 1.23-2.22-.2-1.35 1.31-2.37 4.73 2.62z" fill-rule="evenodd"></path></svg>
  </div>
  <div class="tooltip__icon">
   <svg class="tooltip__icon__svg" width="25" height="25" viewBox="0 0 25 25"><path d="M22.3 4.3c-.82.51-1.72.88-2.67 1.08a4.25 4.25 0 0 0-6.18-.12 4.3 4.3 0 0 0-1.26 3.03c0 .34.04.67.08 1a12.2 12.2 0 0 1-8.81-4.52 4.8 4.8 0 0 0-.62 2.14 4.44 4.44 0 0 0 1.92 3.6 4.13 4.13 0 0 1-1.91-.55v.07c0 2.06 1.47 3.8 3.44 4.21-.37.08-.74.13-1.15.15l-.76-.07a4.32 4.32 0 0 0 3.98 2.99A9.03 9.03 0 0 1 3 19.14l-1-.06A12.26 12.26 0 0 0 8.6 21c7.88 0 12.2-6.55 12.17-12.18.02-.23.02-.41 0-.62a8.06 8.06 0 0 0 2.15-2.23c-.77.37-1.6.6-2.45.7a4.1 4.1 0 0 0 1.84-2.38"></path></svg>
  </div>
  <div class="tooltip__divider"></div>
  <div class="tooltip__icon">
    <svg class="tooltip__icon__svg">
      <path d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z" fill-rule="evenodd"></path>
    </svg>
  </div>
`;

const toolTip = document.createElement("div");
toolTip.classList.add("tooltip");
toolTip.innerHTML = svgs;

const toolTipTail = document.createElement("div");
toolTipTail.classList.add("tooltip__tail");

const articleElement = document.getElementsByClassName("article")[0];

function removeTooltip() {
    if (document.body.contains(toolTip)) {
        toolTip.style.top = null;
        toolTip.style.left = null;
        toolTipTail.style.top = null;
        toolTipTail.style.left = null;
        document.body.removeChild(toolTip);
        document.body.removeChild(toolTipTail);
    }
}

let selectionQueued = false;

function displayTooltip() {
    const selection = document.getSelection();
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;

    document.body.appendChild(toolTip);
    document.body.appendChild(toolTipTail);

    const toolTipWidth = toolTip.offsetWidth;
    const toolTipHeight = toolTip.offsetHeight;
    const toolTipTailWidth = toolTipTail.offsetWidth;
    const toolTipTailHeight = toolTipTail.offsetHeight;

    const rangeRects = selection.getRangeAt(0).getClientRects();

    const parentElement = selection.anchorNode.parentElement;
    const y = rangeRects[0].y;
    const x = rangeRects.length > 1 ?
        parentElement.offsetLeft + parentElement.offsetWidth / 2 :
        rangeRects[0].x + rangeRects[0].width / 2;

    toolTip.style.top = `${y - toolTipHeight - toolTipTailHeight / 2}px`;
    toolTip.style.left = `${x - toolTipWidth / 2}px`;

    toolTipTail.style.top = `${y - toolTipTailHeight / 2}px`;
    toolTipTail.style.left = `${x - toolTipTailWidth / 2}px`;

}

document.onmouseup = () => {
    if (selectionQueued) {
        displayTooltip();
    } else {
        removeTooltip();
    }
    selectionQueued = false;
}

document.addEventListener("selectionchange", function (event) {
    const selection = document.getSelection();
    if (selection.type !== "Range") {
        selectionQueued = false;
        return;
    }

    if (selection.anchorNode != selection.focusNode) {
        // Cross-paragraph selection
        selectionQueued = false;
        return;
    }

    selectionQueued = true;
});
