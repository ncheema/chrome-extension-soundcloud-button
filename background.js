//install html page
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install" || details.reason == "update") {
    chrome.tabs.create({
      url: chrome.extension.getURL('settings/controls.html')
    });
  }

});

//binding for commands/shorcuts
chrome.commands.onCommand.addListener(function(command) {
  if (command === "playback") {
    console.log("playback hit")
    playSong();
  } else if (command === "next") {
    nextSong();
  }
});

//playback button(s) status
//msgs sent by injected content script
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.playButton === "playing") {
      changeIcon("icons/pause.png");
    } else if (request.playButton === "paused") {
      changeIcon("icons/play.png");
    }

  });


//listening to playback commands from  extension button (through pop.js)
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.command === "play") {
    playSong();
  } else if (msg.command === "next") {
    nextSong();
  }
});

function nextSong() {
  chrome.tabs.query({
    url: "https://soundcloud.com/*"
  }, function(results) {
    if (results.length == 0) {
      chrome.tabs.create({
        url: 'https://soundcloud.com/you/likes'
      }, function(newTab) {
        tab = newTab;
      });
    } else {

      tab = (results[0]);
      chrome.tabs.executeScript(tab.id, {
          file: "next.js"
        },
        function() {
          if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
          }
        });
    }
  });
}

var issuedNewTab = false;
//check if the new tab opened has been loaded fully
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, dtab) {

  if (issuedNewTab && changeInfo.status == 'complete') {
    issuedNewTab = false;
    chrome.tabs.executeScript(tabId, {
        file: "delayplayback.js"
      },
      function() {
        if (chrome.runtime.lastError) {
          alert(chrome.runtime.lastError.message);
        }
      });

  }
})

function playSong() {
  chrome.tabs.query({
    url: "https://soundcloud.com/*"
  }, function(results) {
    if (results.length == 0) {
      chrome.tabs.create({
        url: 'https://soundcloud.com/you/likes'
      }, function(newTab) {
        console.log("creating new soundcloud tab")
        issuedNewTab = true;
      });
    } else {
      tab = (results[0]);
      chrome.tabs.executeScript(tab.id, {
          file: "playback.js"
        },
        function() {
          if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
          }
        });
    }
  });
}


//Set click to false at beginning
var alreadyClicked = false;
//Declare a timer variable
var timer;

//Add Default Listener provided by chrome.api.*
//tracks singe and double click on the extension icon
chrome.browserAction.onClicked.addListener(function(tab) {
  if (alreadyClicked) {
    clearTimeout(timer);
    nextSong();
    alreadyClicked = false;
    return;
  }
  //Set Click to  true
  alreadyClicked = true;
  //Add a timer to detect next click to a sample of 250
  timer = setTimeout(function() {
    playSong();
    clearTimeout(timer);
    alreadyClicked = false;
  }, 250);
});

//update extension icon
function changeIcon(img) {
  chrome.browserAction.setIcon({
    "path": img
  }, function() {});
}
