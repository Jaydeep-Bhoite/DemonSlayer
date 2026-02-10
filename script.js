const intro = document.getElementById("intro");
const hug = document.getElementById("hug");
const message = document.getElementById("message");

const aura = document.getElementById("aura");
const teddy = document.getElementById("teddy");
const styleTitle = document.getElementById("styleTitle");
const finalMessage = document.getElementById("finalMessage");

let currentStyle = "";
let holding = false;

const messages = {
  flame: "I’d cross any battlefield just to hold you.",
  water: "Even from afar, I flow back to you.",
  flower: "Soft, warm, and always yours."
};

document.querySelectorAll(".choices button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentStyle = btn.dataset.style;
    intro.classList.remove("active");
    hug.classList.add("active");

    styleTitle.textContent =
      currentStyle === "flame" ? "Flame Breathing"
      : currentStyle === "water" ? "Water Breathing"
      : "Blossom Breathing";

    aura.className = currentStyle;
  });
});

// Press & hold interaction
teddy.addEventListener("pointerdown", () => {
  holding = true;
  aura.style.opacity = 1;
  teddy.style.transform = "scale(1.4)";
  aura.style.transform = "scale(1.4)";

  if (navigator.vibrate) navigator.vibrate(60);
});

teddy.addEventListener("pointerup", release);
teddy.addEventListener("pointerleave", release);

function release() {
  if (!holding) return;
  holding = false;

  hug.classList.remove("active");
  message.classList.add("active");

  finalMessage.textContent = messages[currentStyle];

  if (navigator.vibrate) navigator.vibrate([40, 20, 40]);
}
