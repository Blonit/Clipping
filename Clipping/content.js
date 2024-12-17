document.addEventListener("copy", () => {
    navigator.clipboard.readText()
      .then((text) => {
        const trimmedText = text.trim();
        if (!trimmedText) {
          console.warn("Clipboard text is empty or whitespace.");
          return;
        }
  
        chrome.storage.local.get("clipboardHistory", (result) => {
          const currentHistory = Array.isArray(result.clipboardHistory)
            ? result.clipboardHistory
            : [];
  
          console.log("Current clipboard history:", currentHistory);
  
          const isDuplicate = currentHistory.some(item => item.text === trimmedText);
  
          if (!isDuplicate) {
            const newItem = {
              text: trimmedText,
              date: new Date().toISOString(),
            };
  
            currentHistory.unshift(newItem);
  
            chrome.storage.local.set({ clipboardHistory: currentHistory }, () => {
              console.log("Clipboard item added:", newItem);
            });
          } else {
            console.log("Duplicate clipboard item ignored:", trimmedText);
          }
        });
      })
      .catch((error) => {
        console.error("Failed to read clipboard:", error);
      });
  });
  
