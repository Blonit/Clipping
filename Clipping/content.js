document.addEventListener("copy", () => {
    navigator.clipboard.readText()
      .then((text) => {
        const trimmedText = text.trim(); // 텍스트를 한 번만 트림
        if (!trimmedText) {
          console.warn("Clipboard text is empty or whitespace.");
          return;
        }
  
        chrome.storage.local.get("clipboardHistory", (result) => {
          const currentHistory = Array.isArray(result.clipboardHistory)
            ? result.clipboardHistory
            : [];
  
          console.log("Current clipboard history:", currentHistory);
  
          // 객체 배열로 관리
          const isDuplicate = currentHistory.some(item => item.text === trimmedText);
  
          if (!isDuplicate) {
            const newItem = {
              text: trimmedText,
              date: new Date().toISOString(), // 저장 시간을 추가
            };
  
            currentHistory.unshift(newItem); // 최신 항목을 앞에 추가
  
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
  