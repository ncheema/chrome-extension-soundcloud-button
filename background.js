chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.playButton === "playing") {
      changeIcon("pause.png");
    } else if (request.playButton === "paused") {
      changeIcon("play.png");
    }
  });


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

/***************************************/


//Set click to false at beginning
var alreadyClicked = false;
//Declare a timer variable
var timer;

//Add Default Listener provided by chrome.api.*
chrome.browserAction.onClicked.addListener(function (tab) {
    //Check for previous click
    if (alreadyClicked) {
        //Yes, Previous Click Detected

        //Clear timer already set in earlier Click
        clearTimeout(timer);
        console.log("Double click");
        nextSong();

        //Clear all Clicks
        alreadyClicked = false;
        return;
    }

    //Set Click to  true
    alreadyClicked = true;

    //Add a timer to detect next click to a sample of 250
    timer = setTimeout(function () {
        //No more clicks so, this is a single click
        console.log("Single click");
        playSong();

        //Clear all timers
        clearTimeout(timer);

        //Ignore clicks
        alreadyClicked = false;
    }, 250);
});

//update extension icon
function changeIcon(img) {
  chrome.browserAction.setIcon({
      "path": img
  }, function () {
      console.log("Changed Icon");
  });
}
