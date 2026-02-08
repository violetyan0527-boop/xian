const STORAGE_KEY = "xian_novel";

const fileInput = document.getElementById("docx");
const form = document.getElementById("upload-form");
const titleInput = document.getElementById("title");
const preview = document.getElementById("preview-content");
const summaryContent = document.getElementById("summary-content");
const promoContent = document.getElementById("promo-content");
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

const extractPlainText = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return (temp.textContent || "").replace(/\s+/g, " ").trim();
};

const buildSummary = (text) => {
  if (!text) {
    return "暂无正文可供生成简介。";
  }
  const snippet = text.slice(0, 160);
  return snippet.length < text.length ? `${snippet}…` : snippet;
};

const buildPromo = (title, summary) => {
  return `《${title}》上线啦：${summary} 现在就来阅读这段故事。`;
};

const renderGenerated = (summary, promo) => {
  summaryContent.textContent = summary;
  promoContent.textContent = promo;
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
  const text = extractPlainText(html);
  const summary = buildSummary(text);
  const promo = buildPromo(title, summary);
  renderGenerated(summary, promo);
  const payload = {
    title,
    html,
    summary,
    promo,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  channel?.postMessage("refresh");
});
