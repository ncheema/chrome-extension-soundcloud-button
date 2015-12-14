
//for background console logs
var tab;
//listening to playback commands from pop.js
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command === "play") {
      console.log("calling playSong")
      playSong();
    }
    else if (msg.command === "next") {
      nextSong();
    }
});

function nextSong() {
  chrome.tabs.query({url: "https://soundcloud.com/*"}, function(results) {
  if (results.length == 0) {
        chrome.tabs.create({url: 'https://soundcloud.com/you/likes'}, function(newTab) {
          tab = newTab;
        });
    } else {

      tab = (results[0]);
      console.log("calling playback")
      chrome.tabs.executeScript(tab.id, {file:"next.js"},
      function() {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
        }
    });
    }
  });
}


//check if the new tab opened has been loaded fully
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, dtab) {

  if (tab != undefined && tab.id == tabId && changeInfo.status == 'complete') {
    console.log(changeInfo.status + tabId)
    chrome.tabs.executeScript(tabId, {file:"delayplayback.js"},
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
          console.log("created new tab: " + tab);
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
