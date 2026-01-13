
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tabId = tabs[0].id;
  const currentTab = tabs[0];

  // Display current URL
  const urlElement = document.getElementById("currentUrl");
  const url = new URL(currentTab.url);
  const displayUrl = url.hostname + url.pathname;
  urlElement.textContent = displayUrl;
  urlElement.title = currentTab.url;

  chrome.runtime.sendMessage({ action: "getStatus", tabId: tabId }, function (response) {
    const statusElement = document.getElementById("status");
    const colorIndicator = document.getElementById("colorIndicator");
    const container = document.getElementById("container");

    // Set status message (use innerHTML to support HTML tags like <strong>)
    statusElement.innerHTML = response.message.replace(/\n/g, '<br>');

    // Set color indicator and container background based on icon
    const colorMap = {
      "icon-green.png": { indicator: "#4CAF50", class: "green" },
      "icon-yellow.png": { indicator: "#FFC107", class: "yellow" },
      "icon-red.png": { indicator: "#F44336", class: "red" },
      "icon-blue.png": { indicator: "#2196F3", class: "blue" },
      "icon-grey.png": { indicator: "#9E9E9E", class: "grey" }
    };

    const colors = colorMap[response.icon] || { indicator: "#9E9E9E", class: "grey" };
    colorIndicator.style.backgroundColor = colors.indicator;
    container.className = "container " + colors.class;

    // Show reload button if needed
    if (response.showReload) {
      const reloadBtn = document.getElementById("reload");
      reloadBtn.style.display = "block";
      reloadBtn.onclick = () => chrome.tabs.reload(tabId);
    }

    // Copy button functionality
    const copyBtn = document.getElementById("copy");
    copyBtn.onclick = () => {
      const copyText = `URL: ${currentTab.url}\n\n${response.message}`;
      navigator.clipboard.writeText(copyText).then(() => {
        copyBtn.textContent = "✓ Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "📋 Copy Status";
          copyBtn.classList.remove("copied");
        }, 2000);
      });
    };
  });
});
