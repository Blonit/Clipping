document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("clipboardList");
  const clearButton = document.getElementById("clear-history");

  if (!list) {
    console.error("Error: 'clipboardList' element not found in the DOM.");
    return;
  }

  // 클립보드 기록 렌더링 함수
  function renderClipboardHistory() {
    chrome.storage.local.get("clipboardHistory", (result) => {
      const history = result.clipboardHistory || [];
      list.innerHTML = "";

      if (history.length === 0) {
        list.innerHTML = "<li>No items yet...</li>";
      } else {
        history.forEach((item) => {
          const li = document.createElement("li");
          li.style.borderBottom = "1px solid #ddd";
          li.style.display = "flex";
          li.style.alignItems = "center";
          li.style.justifyContent = "space-between";
          li.style.padding = "10px";
          li.style.cursor = "pointer";

          // 텍스트 스팬
          const textSpan = document.createElement("span");
          textSpan.textContent = item.text;
          textSpan.title = item.text;
          textSpan.style.display = "block";
          textSpan.style.whiteSpace = "nowrap";
          textSpan.style.overflow = "hidden";
          textSpan.style.textOverflow = "ellipsis";
          textSpan.style.width = "300px";

          // 날짜 표시
          const dateSpan = document.createElement("span");
          const now = new Date(item.date);
          const hours = now.getHours();
          const minutes = now.getMinutes().toString().padStart(2, "0");
          const seconds = now.getSeconds().toString().padStart(2, "0");
          const timeOnly = `${hours}:${minutes}:${seconds}`;
          dateSpan.textContent = timeOnly;
          dateSpan.style.fontSize = "0.8em";
          dateSpan.style.color = "#888";
          dateSpan.style.marginLeft = "10px";

          // 삭제 버튼
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "✖️";
          deleteButton.style.marginLeft = "10px";
          deleteButton.style.textAlign = "center";

          deleteButton.addEventListener("mouseover", () => {
            li.style.backgroundColor = "#f4f4f4";
          });

          deleteButton.addEventListener("mouseout", () => {
            li.style.backgroundColor = "";
          });

          deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteItem(item.text); // 고유한 텍스트 값으로 삭제
          });

          const searchButton  = document.createElement("button");
          searchButton .textContent = "🔍";
          searchButton .style.marginLeft = "10px";
          searchButton .style.textAlign = "center";

          searchButton.addEventListener("mouseover", () => {
            li.style.backgroundColor = "#f4f4f4";
          });

          searchButton.addEventListener("mouseout", () => {
            li.style.backgroundColor = "";
          });

          searchButton.addEventListener("click", (event) => {
            event.stopPropagation();
            openSearchTab(item.text); // 새 탭에서 검색
          });

          // 복사 클릭 이벤트
          li.addEventListener("click", () => {
            navigator.clipboard
              .writeText(item.text)
              .then(() => alert(`Copied to clipboard: ${item.text}`))
              .catch((error) => console.error("Failed to copy to clipboard:", error));
          });

          li.appendChild(textSpan);
          li.appendChild(dateSpan);
          li.appendChild(searchButton);
          li.appendChild(deleteButton);
          list.appendChild(li);
        });
      }
    });
  }

  function openSearchTab(query) {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
    chrome.tabs.create({ url: searchUrl });
  }

  // 특정 항목 삭제 함수
  function deleteItem(text) {
    chrome.storage.local.get("clipboardHistory", (result) => {
      const history = result.clipboardHistory || [];
      const updatedHistory = history.filter((item) => item.text !== text); // 텍스트 기반 삭제
      chrome.storage.local.set({ clipboardHistory: updatedHistory }, () => {
        console.log(`Item with text "${text}" deleted.`);
        renderClipboardHistory();
      });
    });
  }

  // 초기 렌더링
  renderClipboardHistory();

  // Clear 버튼 이벤트
  clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all clipboard history?")) {
      chrome.storage.local.set({ clipboardHistory: [] }, () => {
        console.log("Clipboard history cleared.");
        renderClipboardHistory();
      });
    }
  });
});
