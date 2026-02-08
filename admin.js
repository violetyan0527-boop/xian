const STORAGE_KEY = "xian_novel";

const fileInput = document.getElementById("docx");
const form = document.getElementById("upload-form");
const titleInput = document.getElementById("title");
const preview = document.getElementById("preview-content");
let channel = null;

const renderPreview = (html) => {
  preview.innerHTML = html;
};

const parseDocx = async (file) => {
  if (!window.mammoth) {
    return "<p>解析组件未加载，请刷新页面或检查网络连接。</p>";
  }
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.convertToHtml({ arrayBuffer });
  return result.value || "<p>解析成功，但未检测到正文。</p>";
};

if ("BroadcastChannel" in window) {
  channel = new BroadcastChannel("xian_novel_updates");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = fileInput?.files?.[0];
  if (!file) {
    renderPreview("<p>请选择 DOCX 文件。</p>");
    return;
  }
  const html = await parseDocx(file);
  renderPreview(html);
  const title = titleInput?.value?.trim() || file.name.replace(/\.docx$/i, "");
  const payload = {
    title,
    html,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  channel?.postMessage("refresh");
});
