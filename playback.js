
var playButton = document.querySelector('.playControl');
console.log(playButton);
if (playButton === undefined) {
  playButton =  document.querySelector('.heroPlayButton')
}
playButton.click();
