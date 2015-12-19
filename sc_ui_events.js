window.addEventListener("load", main, false);

function main(evt) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 122);

  //wait for music list to load by checking for either the hero button
  //or the sc-button-play is loaded
  function checkForJS_Finish() {
    //we need to grab one of the these buttons (playControl button always loads)
    if (document.querySelector('.heroPlayButton') || document.querySelector('.sc-button-play')) {
      clearInterval(jsInitChecktimer);
      console.log("making progress");
      addObserver();
    }
  }
}





//add event listeners to all play controls
function addObserver() {
  // select the target node
  var target = document.querySelector('.playControl');

  // create an observer instance
  var observer = new MutationObserver(function(mutations) {
    console.log(mutations[0].target.title)
    var msg = getMsg();
    if (msg != undefined) sendMessg(msg);
    console.log("sent message ");
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

//TODO: id is currently hardcoded, check security risks and correct way to publish
var extensionId = "pcnpjocajfmcnbaiahneejbkjhddhbjg";

//send msg to background script to make ui changes to button
function sendMessg(msg) {
  console.log("sending");
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
