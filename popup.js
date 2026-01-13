
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tabId = tabs[0].id;
  chrome.runtime.sendMessage({ action: "getStatus", tabId: tabId }, function (response) {
    document.getElementById("status").textContent = response.message;
    if (response.showReload) {
      const btn = document.getElementById("reload");
      btn.style.display = "inline-block";
      btn.onclick = () => chrome.tabs.reload(tabId);
    }
  });
});
