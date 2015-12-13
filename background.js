
//for background console logs
var tab;
//listening to playback commands from pop.js
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command === "play") {
      console.log("calling playSong")
      playSong();


    }
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (tab.id = tabId && changeInfo.status == 'complete') {
    console.log(changeInfo.status + tabId)
    chrome.tabs.executeScript(tabId, {file:"playback.js"},
    function() {
      if (chrome.runtime.lastError) {
          alert(chrome.runtime.lastError.message);
      }
  });

  }
})
function playSong() {

  chrome.tabs.query({url: "https://soundcloud.com/*"}, function(results) {
  if (results.length == 0) {
        chrome.tabs.create({url: 'https://soundcloud.com/you/likes'}, function(newTab) {
          tab = newTab;
        });
    } else {

      tab = (results[0]);
      console.log("calling playback")
      chrome.tabs.executeScript(tab.id, {file:"playback.js"},
      function() {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
        }
    });
    }
});
}
