document.addEventListener("copy", () => {
  navigator.clipboard.readText()
    .then((text) => {
      if (text.trim()) {
        chrome.storage.local.get("clipboardHistory", (result) => {
          console.log("Raw result from storage:", result);

          const currentHistory = Array.isArray(result.clipboardHistory) 
            ? result.clipboardHistory 
            : [];

          console.log("Current history after initialization:", currentHistory);

          if (!currentHistory.includes(text)) {
            currentHistory.push(text);
            chrome.storage.local.set({ clipboardHistory: currentHistory }, () => {
              console.log("Updated clipboard history:", currentHistory);
            });
          } else {
            console.log("Duplicate item ignored:", text);
          }
        });
      } else {
        console.warn("Clipboard text is empty or whitespace.");
      }
    })
    .catch((error) => {
      console.error("Failed to read clipboard:", error);
    });
});