const port = chrome.extension.connect();

port.postMessage({action: 'start'}); // start shit
//chrome.browserAction.setBadgeBackgroundColor({ color: [35,35,35, 255] });
//chrome.browserAction.setBadgeText({text: "OFF"})

button.onclick = function() {
  port.postMessage({action: 'off'}); // turn it off
  window.close();
}


