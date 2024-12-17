chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveClipboardItem") {
    chrome.storage.local.get("clipboardHistory", (result) => {
      const clipboardHistory = Array.isArray(result.clipboardHistory)
        ? result.clipboardHistory
        : [];

      const newItem = {
        text: message.text || "",
        date: new Date().toISOString(),
      };

      // 중복 확인
      const isDuplicate = clipboardHistory.some(
        (item) => item.text === newItem.text && item.url === newItem.url
      );

      if (!isDuplicate) {
        clipboardHistory.unshift(newItem);

        chrome.storage.local.set({ clipboardHistory }, () => {
          console.log("Item saved to clipboard history:", newItem);
          sendResponse({ status: "saved", message: "Item saved!" });
        });
      } else {
        console.log("Duplicate item ignored:", newItem);
        sendResponse({ status: "duplicate", message: "Duplicate item ignored!" });
      }
    });
    return true; // 비동기 응답
  } else if (message.action === "getClipboardHistory") {
    chrome.storage.local.get("clipboardHistory", (result) => {
      sendResponse(result.clipboardHistory || []);
    });
    return true; // 비동기 응답
  }
});
