//Download app
const downloadBtn = document.getElementById("downloadBtn");
const downloadPop = document.getElementById("downloadPop");
const downloadWrap = document.getElementById("downloadWrap");

function toggleDownload(open) {
    downloadPop.hidden = !open;
    downloadBtn.setAttribute("aria-expanded", open);    
}
downloadBtn.onclick = (e) => { e.stopPropagation(), toggleDownload(downloadPop.hidden);};
document.addEventListener("click", (e) => { if (!downloadWrap.contains(e.target)) toggleDownload(false); });
window.addEventListener("keydown", (e) => { if (e.key === "Escappe") toggleDownload(false);});
document.getElementById("downloadGo").addEventListener("click", () => setTimeout(() => toggleDownload(false), 200));
