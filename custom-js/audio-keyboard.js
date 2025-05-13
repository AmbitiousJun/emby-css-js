const showBubble = (value = "") => {
  let div = document.getElementById("custom-audio-bubble");
  let append = false;
  if (!div) {
    div = document.createElement("div");
    append = true;
  }
  div.id = "custom-audio-bubble";
  div.style = `
    position: absolute;
    right: 20px;
    top: 100px;
    transition: .3s;
    padding: 0 10px;
    opacity: 100;
    text-align: center;
  `;
  div.className = "dialog";
  div.innerHTML = `<h2 style="width: 7em;display:flex;align-items:center;justify-content:flex-start">当前音量：${value}</h2>`;
  append && document.body.appendChild(div);
  hideBubble(div);
};

const hideBubble = (() => {
  let timerId;
  return (elm) => {
    if (!elm) {
      return;
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => elm.style.opacity = "0", 2000);
  };
})();

const changeVolume = (stepFunc = () => {}) => {
  const slider = document.querySelector(".emby-slider");
  if (!slider) {
    return;
  }
  stepFunc.call(slider);
  slider.dispatchEvent(
    new CustomEvent("change", {
      bubbles: !0,
      cancelable: !1,
      detail: {
        isStep: !0,
      },
    })
  );
  showBubble(slider.value);
};

document.addEventListener("keydown", (event) => {
  const keyPressed = event.key.toLowerCase();
  if (keyPressed === "w") {
    changeVolume(HTMLInputElement.prototype.stepUp);
  } else if (keyPressed === "s") {
    changeVolume(HTMLInputElement.prototype.stepDown);
  }
});
