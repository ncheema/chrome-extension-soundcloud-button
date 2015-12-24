window.addEventListener("load", main, false);

function main(evt) {
  addObserver();
}

//observe changes in  playback controls
function addObserver() {
  // select the target node
  var target = document.querySelector('.playControl');

  // create an observer instance
  var observer = new MutationObserver(function(mutations) {
    var msg = getMsg();
    if (msg != undefined) sendMessg(msg);
  });

  // configuration of the observer:
  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
}



//extensionId is sent dynamically in the content script (myscript.js)
//send msg to background script to make ui changes to button
function sendMessg(msg) {
  console.log("sending: " + msg);
  chrome.runtime.sendMessage(extensionId, {
      playButton: msg
    },
    function(response) {});
}

//current status of playControl
function getMsg() {
  var title = (document.querySelector('.playControl').title).toLowerCase();
  var msg;
  //current track is paused
  if (title.indexOf("play") != -1) {
    msg = "paused";
  } else if (title.indexOf("pause") != -1) {
    msg = "playing";
  }
  return msg;
}
