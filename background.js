chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get(["savedUrls"], (data) => {
    console.log("Background got data from storage:", data);
    if (chrome.runtime.lastError) {
      console.error("Storage error:", chrome.runtime.lastError);
      return;
    }

    const urls = data.savedUrls || [];
    console.log("urls")
    console.log(urls)
    console.log("urls")
    if (!urls.length) {
      chrome.runtime.openOptionsPage();
      return;
    }
    console.log(`Opening ${urls.length} URLs...`);
    urls.forEach(url => {
      chrome.tabs.create({ url });
    });
  });
});
