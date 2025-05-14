//
//  author: @AmbitiousJun
//    repo: https://github.com/AmbitiousJun/emby-css-js
// version: v1.1.0
//

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
    right: 2em;
    top: 7em;
    transition: .2s;
    padding: 0 10px;
    opacity: 100;
    transform: translateX(0);
    text-align: center;
  `;
  div.className = "dialog";
  div.innerHTML = `
    <h2 style="width: 5em;display:flex;align-items:center;justify-content:flex-start">音量：${value}</h2>
    <div id="custom-audio-bar" style="width: 95%;border-radius: 10px;transform: translateY(-1em);margin: 0 auto;">
      <div id="custom-audio-bar__inner" style="width: 0;border: 1.5px solid #fff;border-radius: 10px;"></div>
    </div>
  `;
  append && document.body.appendChild(div);

  const bar = document.getElementById("custom-audio-bar");
  const barInner = document.getElementById("custom-audio-bar__inner");
  const percent = parseFloat(value);
  const curWidth = Math.floor(bar.offsetWidth * percent / 100);
  barInner.style.width = `${curWidth}px`
  curWidth === 0 && (barInner.style.borderColor = "transparent");
  curWidth !== 0 && (barInner.style.borderColor = "#fff");

  hideBubble(div);
};

const hideBubble = (() => {
  let timerId;
  return (elm) => {
    if (!elm) {
      return;
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      elm.style.opacity = "0";
      elm.style.transform = "translateX(calc(2em + 100%))";
    }, 2000);
  };
})();

const changeVolume = (stepFunc = () => {}) => {
  const slider = document.querySelector(".videoOsdVolumeSlider");
  const atPlayerPage = window.location.href.endsWith("videoosd.html");
  if (!slider || !atPlayerPage) {
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

// 鼠标放在音量条上时弹出文字提示
window.addEventListener("load", () => {
  const addTipBubble = (node) => {
    const div = document.createElement("div");
    div.className = "sliderBubble dialog";
    div.style = "inset-inline-start: -5em";
    div.innerHTML = `
      <h3 style="display: flex;flex-direction: column;text-align:right;padding: 0 10px;">
        <span>W: 增大音量</span>
        <span>S: 减小音量</span>
      </h3>
    `;
    node.appendChild(div);
  };

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          const elements = (node.getElementsByClassName ? node.getElementsByClassName("videoOsdBottom") : []);
          if (elements.length > 0) {
            const container = elements[0].getElementsByClassName("sliderContainer") || [];
            container.length > 0 &&
              setTimeout(() => addTipBubble(container[container.length - 1]));
          }
        });
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
