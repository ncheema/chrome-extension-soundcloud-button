
if (window.addEventListener) {
  {window.addEventListener('load', play(), false);}
 }
//alert(document.querySelector('.playing'));
function play() {
  var playButton = document.querySelector('.playControl');
  console.log("b " + playButton.disabled);
  if (playButton === undefined) {
    playButton = document.querySelector('.heroPlayButton')
  }
  playButton.click();
}
