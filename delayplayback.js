//script is called if new soundcloud is opened

/*
* script is called if new soundcloud is opened
* ISSUE - time deplay
* QUICK FIX -  solution to solve the issue realted to page
* delay caused by new tab
*/
setTimeout(function(){
  var playButton = document.querySelector('.playControl');
console.log("b " + playButton.disabled);
while (playButton === undefined) {
  playButton =  document.querySelector('.heroPlayButton')
}
playButton.click();
 }, 1000);
