let clipboardHistory = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveToClipboard") {
    chrome.storage.local.get("clipboardHistory", (result) => {
      clipboardHistory = Array.isArray(result.clipboardHistory)
        ? result.clipboardHistory
        : [];

      if (!clipboardHistory.some(item => item.text === message.text)) {
        const newItem = {
          text: message.text,
        };
        clipboardHistory.unshift(newItem);

        chrome.storage.local.set({ clipboardHistory }, () => {
          console.log("Text saved to clipboard history:", newItem);
          sendResponse({ status: "saved", message: "Text saved to clipboard history!" });
        });
      } else {
        console.log("Duplicate item ignored:", message.text);
        sendResponse({ status: "duplicate", message: "Duplicate item ignored!" });
      }
    });
    return true;
  } else if (message.action === "getClipboardHistory") {
    chrome.storage.local.get("clipboardHistory", (result) => {
      sendResponse(result.clipboardHistory || []);
    });
    return true;
  }
});
