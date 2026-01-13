
let tabCacheStatus = {};

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.type !== "main_frame" || details.tabId < 0) return;
    const tabId = details.tabId;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => performance.getEntriesByType("navigation")[0]?.transferSize === 0,
    }, (results) => {
      const headers = details.responseHeaders.reduce((acc, header) => {
        acc[header.name.toLowerCase()] = header.value;
        return acc;
      }, {});

      const cfStatus = (headers["cf-cache-status"] || "N/A").toUpperCase();
      const lsCache = (headers["x-litespeed-cache"] || "N/A").toUpperCase();
      const browserCacheUsed = !chrome.runtime.lastError && results && results[0]?.result === true;

      let icon = "icon-red.png";
      let message = "";
      let showReload = false;
      let badgeText = "";
      let badgeColor = "";

      if (browserCacheUsed) {
        icon = "icon-blue.png";
        message = "<strong>The page is being loaded from your browser cache.</strong>\n\nReload the page to view the current online cache status.";
        showReload = true;
        badgeText = "CACHE";
        badgeColor = "#2196F3";
      } else if (cfStatus === "N/A" && lsCache === "N/A") {
        icon = "icon-grey.png";
        message = "<strong>Cloudflare and LiteSpeed cache not found.</strong>";
        showReload = false;
        badgeText = "N/A";
        badgeColor = "#9E9E9E";
      } else if (cfStatus === "MISS" && lsCache === "MISS") {
        icon = "icon-red.png";
        message = `Cloudflare: ${cfStatus}\n\nLiteSpeed: ${lsCache}\n\n<strong>Please reload the page to improve the cache status.</strong> Click the button below.`;
        showReload = true;
        badgeText = "MISS";
        badgeColor = "#F44336";
      } else if (cfStatus === "HIT") {
        icon = "icon-green.png";
        if (lsCache === "HIT") {
          message = "Cloudflare: HIT\n\nLiteSpeed: HIT\n\n<strong>The cache status is perfect, and you don't need to do anything further.</strong>";
        } else {
          message = "Cloudflare: HIT\n\nLiteSpeed: " + lsCache + "\n\n<strong>The cache status is perfect</strong> even though LiteSpeed does not have a cache HIT. The LiteSpeed cache is not used if the Cloudflare cache status gives a HIT, which it does here. No further action is required.";
        }
        badgeText = "HIT";
        badgeColor = "#4CAF50";
      } else if (lsCache === "HIT") {
        icon = "icon-yellow.png";
        message = `Cloudflare: ${cfStatus}\n\nLiteSpeed: ${lsCache}\n\n<strong>Please reload the page to improve the cache status.</strong> Click the button below.`;
        showReload = true;
        badgeText = "HIT";
        badgeColor = "#FFC107";
      } else {
        icon = "icon-red.png";
        message = `Cloudflare: ${cfStatus}\n\nLiteSpeed: ${lsCache}\n\n<strong>Please reload the page to improve the cache status.</strong> Click the button below.`;
        showReload = true;
        badgeText = "MISS";
        badgeColor = "#F44336";
      }

      chrome.action.setIcon({ path: { 16: icon, 48: icon, 128: icon }, tabId: tabId });
      chrome.action.setBadgeText({ text: badgeText, tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: badgeColor, tabId: tabId });
      tabCacheStatus[tabId] = { icon, message, showReload };
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "getStatus" && req.tabId !== undefined) {
    const status = tabCacheStatus[req.tabId];
    if (!status || (status.message === "Status unknown.")) {
      sendResponse({ icon: "icon-grey.png", message: "<strong>Cloudflare and LiteSpeed cache not found.</strong>", showReload: false });
    } else {
      sendResponse(status);
    }
  }
});

chrome.webNavigation.onCommitted.addListener((info) => {
  const status = tabCacheStatus[info.tabId];
  if (status) {
    chrome.action.setIcon({ path: { 16: status.icon, 48: status.icon, 128: status.icon }, tabId: info.tabId });
  }
});
