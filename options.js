const urlInput = document.getElementById("urlInput");
const addUrlBtn = document.getElementById("addUrlBtn");
const urlListEl = document.getElementById("urlList");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");
const saveReminderEl = document.getElementById("saveReminder");
const openExtensionsBtn = document.getElementById("openExtensionsBtn");
const totalUrlCount = document.getElementById("total-url-count");

const pasteModal = document.getElementById('pasteModal');
const pasteTextarea = document.getElementById('pasteTextarea');
const cancelPasteBtn = document.getElementById('cancelPasteBtn');
const addPasteBtn = document.getElementById('addPasteBtn');
const openPasteModalBtn = document.getElementById('openPasteModalBtn');

let urls = [];
let dragSrcIndex = null;


// Open modal
openPasteModalBtn.addEventListener('click', () => {
  pasteTextarea.value = '';
  pasteModal.style.display = 'flex';
  pasteTextarea.focus();
});

// Cancel modal
cancelPasteBtn.addEventListener('click', () => {
  pasteModal.style.display = 'none';
});

// Add URLs from modal
addPasteBtn.addEventListener('click', () => {
  const rawText = pasteTextarea.value.trim();
  if (!rawText) {
    alert('Please paste some URLs.');
    return;
  }
  // Split by newline or comma, then normalize & add
  const rawUrls = rawText.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);

  let addedCount = 0;
  rawUrls.forEach(rawUrl => {
    const normalized = normalizeUrl(rawUrl);
    if (normalized && !urls.includes(normalized)) {
      urls.push(normalized);
      addedCount++;
    }
  });

  if (addedCount) {
    renderUrls();
    markUnsaved();  // Show save reminder
  }
  statusEl.textContent = `${addedCount} URLs added from paste.`;
  statusEl.style.color = 'green';
  pasteModal.style.display = 'none';
});


function openExtensionBtn() {
  console.log("hello")
  chrome.tabs.create({ url: 'chrome://extensions/' });
};

openExtensionsBtn.addEventListener("click", () => {
  console.log("hello")
  chrome.tabs.create({ url: 'chrome://extensions/' });
})

function markUnsaved() {
  // saveReminderEl.style.display = "block";
  statusEl.textContent = `⚠️ Changes not saved. Click "Save All" to save your URLs.`;
  statusEl.style.color = 'red';
}

// Normalize and validate URL (add https:// if missing)
function normalizeUrl(url) {
  url = url.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

function handleDragStart(e) {
  dragSrcIndex = Number(e.currentTarget.dataset.index);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  e.currentTarget.style.opacity = '0.4';

  e.currentTarget.classList.add('dragging');  // ADD dragging style
}

function handleDragOver(e) {
  e.preventDefault(); // Necessary to allow drop
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  e.currentTarget.classList.add('over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('over');
}

function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.

  const dragTargetIndex = Number(e.currentTarget.dataset.index);
  if (dragSrcIndex === null || dragTargetIndex === dragSrcIndex) return false;

  // Swap urls in array
  const draggedUrl = urls[dragSrcIndex];
  urls.splice(dragSrcIndex, 1);
  urls.splice(dragTargetIndex, 0, draggedUrl);

  dragSrcIndex = null;

  renderUrls();
  markUnsaved();       // <---- Show reminder
  return false;
}

function handleDragEnd(e) {
  e.currentTarget.style.opacity = '1';
  e.currentTarget.classList.remove('dragging');  // REMOVE dragging style
  [...urlListEl.querySelectorAll('li')].forEach(item => {
    item.classList.remove('over');
  });
}

// Render URL list in UI with drag and drop handlers
function renderUrls() {
  urlListEl.innerHTML = "";
  const totalUrls = urls.length || 0
  totalUrlCount.innerText = `Total Urls: ${totalUrls}`
  if(totalUrls <= 0){
    urlListEl.style.display = "None"
    return false
  }
  urlListEl.style.display = "block"
  urls.forEach((url, idx) => {
    const li = document.createElement("li");
    li.textContent = url;
    li.setAttribute('draggable', true);
    li.dataset.index = idx;

    // Drag event listeners
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragend', handleDragEnd);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => {
      urls.splice(idx, 1);
      renderUrls();
      markUnsaved();       // <---- Show reminder
    };

    li.appendChild(removeBtn);
    urlListEl.appendChild(li);
  });
}

// Add URL button click
function addUrl() {
  const normalized = normalizeUrl(urlInput.value);
  if (!normalized) {
    statusEl.textContent = "Invalid URL. Please check and try again.";
    statusEl.style.color = "red";
    return;
  }
  if (urls.includes(normalized)) {
    statusEl.textContent = "URL already added.";
    statusEl.style.color = "orange";
    return;
  }
  urls.push(normalized);
  urlInput.value = "";
  statusEl.textContent = "";
  renderUrls();
  markUnsaved();       // <---- Show reminder
}
// Add URL button click
addUrlBtn.addEventListener("click", () => {
  const normalized = normalizeUrl(urlInput.value);
  if (!normalized) {
    statusEl.textContent = "Invalid URL. Please check and try again.";
    statusEl.style.color = "red";
    return;
  }
  if (urls.includes(normalized)) {
    statusEl.textContent = "URL already added.";
    statusEl.style.color = "orange";
    return;
  }
  urls.push(normalized);
  urlInput.value = "";
  statusEl.textContent = "";
  renderUrls();
  markUnsaved();       // <---- Show reminder
});

// Save URLs to storage
saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({ savedUrls: urls }, () => {
    statusEl.textContent = "URLs saved successfully!";
    statusEl.style.color = "green";
    saveReminderEl.style.display = "none";  // <---- Hide reminder
    setTimeout(() => (statusEl.textContent = ""), 2500);
  });
});

// Save on Enter key in the input field
urlInput.addEventListener("keydown", (e) => {
  if(urlInput.value.length <= 0){
    return false
  }
  else if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission or default action
    addUrl();
  }
});

// Load saved URLs on page load
chrome.storage.local.get("savedUrls", (data) => {
  urls = data.savedUrls || [];
  renderUrls();
});
