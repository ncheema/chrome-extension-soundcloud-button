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
      addEventListeners();
    }
  }
}

//add event listeners to all play controls
function addEventListeners() {
  var playButtons = [document.querySelector('.heroPlayButton'),
    document.querySelector('.sc-button-play'), document.querySelector('.playControl')
  ];
  for (var i = 0; i < playButtons.length; i++) {
    if (playButtons[i] != null) {
      playButtons[i].addEventListener('click', function(eventt) {
        var msg = getMsg();
        if (msg != undefined) sendMessg(msg);
        console.log("sent message " );
      });
    } else console.log("got a null boi " + i);
  }
}

//TODO: id is currently hardcoded, check security risks and correct way to publish
var extensionId = "FFFFFFFFFFFF";

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
