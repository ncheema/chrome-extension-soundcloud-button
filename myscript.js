
//console.log("injecting content script \n");

var script = document.createElement('script');

//inject the extensionId
script.textContent = "var extensionId = " + JSON.stringify(chrome.runtime.id);
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);


script = document.createElement('script');
//inject playback obsever 
script.src = chrome.extension.getURL('sc_ui_events.js');
script.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script);
