document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("clipboardList");
  const clearButton = document.getElementById("clear-history");

  if (!list) {
    console.error("Error: 'clipboardList' element not found in the DOM.");
    return;
  }

  function renderClipboardHistory() {
    chrome.storage.local.get("clipboardHistory", (result) => {
      const history = result.clipboardHistory || [];
      list.innerHTML = "";

      if (history.length === 0) {
        list.innerHTML = "<li>No items yet...</li>";
      } else {
        history.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          li.style.borderBottom = "1px solid #ddd";

          const textSpan = document.createElement("span");
          textSpan.textContent = item;
          textSpan.style.flex = "1";

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.style.marginLeft = "10px";

          deleteButton.addEventListener("mouseover", () => {
            li.style.backgroundColor = "#f4f4f4";
          });

          deleteButton.addEventListener("mouseout", () => {
            li.style.backgroundColor = "";
          });

          deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const currentIndex = Array.from(list.children).indexOf(li);
            if (currentIndex >= 0) {
              deleteItem(currentIndex);
            }
          });

          li.appendChild(deleteButton);

          li.addEventListener("click", () => {
            navigator.clipboard.writeText(item).then(() => {
              alert(`Copied to clipboard: ${item}`);
            }).catch((error) => {
              console.error("Failed to copy to clipboard:", error);
            });
          });

          list.appendChild(li);
        });
      }
    });
  }

  function deleteItem(index) {
    chrome.storage.local.get("clipboardHistory", (result) => {
      const history = result.clipboardHistory || [];
      history.splice(index, 1);
      chrome.storage.local.set({ clipboardHistory: history }, () => {
        console.log(`Item at index ${index} deleted.`);
        renderClipboardHistory();
      });
    });
  }

  renderClipboardHistory();

  clearButton.addEventListener("click", () => {
    chrome.storage.local.set({ clipboardHistory: [] }, () => {
      console.log("Clipboard history cleared in storage.");
      renderClipboardHistory();
    });
  });
});
