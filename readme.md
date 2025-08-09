# Multiple Tab Opener En - Chrome Extension

**Multiple Tab Opener En** is a lightweight Chrome extension that lets you manage a list of URLs and open all of them at once with a single click.

---

## Features

- Add, remove, and reorder multiple URLs in an easy-to-use options page
- Add a list of urls as a text and extract these urls automatically
- Drag-and-drop support for URL reordering  
- Save URLs persistently using Chrome's local storage  
- Click the extension icon to open all saved URLs in new tabs  
- Automatically opens the options page if no URLs are saved  

---

## Installation

1. Download or clone this repository to your computer.  
    ```bash
    git clone https://github.com/MRIEnan/multiple_tab_opener_en
    cd multiple_tab_opener_en
    ```
2. Open Chrome and go to `chrome://extensions/`.  
3. Enable **Developer mode** (toggle in top right).  
4. Click **Load unpacked** and select the folder containing the extension files.  

---

## Usage

- Click the extension icon to open all saved URLs in new tabs.  
- To manage URLs, right-click the icon and choose **Options**, or open the options page from the extensions page.  
- Add new URLs using the input box, then click **Add**.  
- Rearrange URLs by dragging and dropping them in the list.  
- Remove URLs by clicking the **Remove** button next to each URL.  
- Click **Save All** to save your changes. Unsaved changes will prompt a reminder.  

---

## Development

- URLs are stored using `chrome.storage.local` for extension-wide access.  
- Background script listens for extension icon clicks to open tabs.  
- Options page implements drag-and-drop for reordering URLs.  

---

## Permissions

The extension requires the following permissions:  

- `storage` — to save URLs persistently.  
- `tabs` — to open URLs in new tabs programmatically.  

---

## Troubleshooting

- If clicking the icon opens the options page unexpectedly, it means no URLs are saved. Make sure to add and save URLs first.  
- Use Chrome DevTools to check `chrome.storage.local` contents and debug.  

---
## License
MIT License © Mainur Rahman

## Contact
For issues, questions, or feature requests, please open an issue on the GitHub repository or contact Mainur Rahman.