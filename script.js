const STORAGE_KEY = "xian_novel";

const titleEl = document.getElementById("novel-title");
const contentEl = document.getElementById("novel-content");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const toggleBtn = document.getElementById("toggle");

let fontScale = 1;
let channel = null;

const renderNovel = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return;
  }
  const data = JSON.parse(stored);
  titleEl.textContent = data.title || "无标题";
  contentEl.innerHTML = data.html || "<p>暂无内容。</p>";
};

const updateFont = () => {
  contentEl.style.fontSize = `${1.05 * fontScale}rem`;
};

increaseBtn?.addEventListener("click", () => {
  fontScale = Math.min(fontScale + 0.1, 1.6);
  updateFont();
});

decreaseBtn?.addEventListener("click", () => {
  fontScale = Math.max(fontScale - 0.1, 0.8);
  updateFont();
});

toggleBtn?.addEventListener("click", () => {
  document.body.classList.toggle("night");
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    renderNovel();
  }
});

if ("BroadcastChannel" in window) {
  channel = new BroadcastChannel("xian_novel_updates");
  channel.addEventListener("message", (event) => {
    if (event.data === "refresh") {
      renderNovel();
    }
  });
}

renderNovel();
updateFont();
