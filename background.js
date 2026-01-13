
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

      if (browserCacheUsed) {
        icon = "icon-blue.png";
        message = "The page is being loaded from your browser cache.\n\nReload the page to view the current online cache status.";
        showReload = true;
      } else if (cfStatus === "N/A" && lsCache === "N/A") {
        icon = "icon-grey.png";
        message = "The site is not powered by Cloudflare nor LiteSpeed.";
        showReload = false;
      } else if (cfStatus === "MISS" && lsCache === "MISS") {
        icon = "icon-red.png";
        message = `Cloudflare: ${cfStatus}\n\nLiteSpeed: ${lsCache}\n\nPlease reload the page to improve the cache status. Click the button below.`;
        showReload = true;
      } else if (cfStatus === "HIT") {
        icon = "icon-green.png";
        if (lsCache === "HIT") {
          message = "Cloudflare: HIT\n\nLiteSpeed: HIT\n\nThe cache status is perfect, and you don't need to do anything further.";
        } else {
          message = "Cloudflare: HIT\n\nLiteSpeed: " + lsCache + "\n\nThe cache status is perfect even though LiteSpeed does not have a cache HIT. The LiteSpeed cache is not used if the Cloudflare cache status gives a HIT, which it does here. No further action is required.";
        }
      } else if (lsCache === "HIT") {
        icon = "icon-yellow.png";
        message = `Cloudflare: ${cfStatus}\n\nLiteSpeed: ${lsCache}\n\nPlease reload the page to improve the cache status. Click the button below.`;
        showReload = true;
      } else {
        icon = "icon-red.png";
        message = `Cloudflare: ${cfStatus}\n\nLiteSpeed: ${lsCache}\n\nPlease reload the page to improve the cache status. Click the button below.`;
        showReload = true;
      }

      chrome.action.setIcon({ path: { 16: icon, 48: icon, 128: icon }, tabId: tabId });
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
      sendResponse({ icon: "icon-grey.png", message: "The site is not powered by Cloudflare nor LiteSpeed.", showReload: false });
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
