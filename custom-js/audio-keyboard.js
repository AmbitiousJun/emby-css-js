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
};

// 监听键盘的 w 键和 s 键调节音量
document.addEventListener("keydown", (event) => {
  const keyPressed = event.key.toLowerCase();
  if (keyPressed === "w") {
    changeVolume(HTMLInputElement.prototype.stepUp);
  } else if (keyPressed === "s") {
    changeVolume(HTMLInputElement.prototype.stepDown);
  }
});

