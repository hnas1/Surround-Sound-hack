let audioCtx;
let streamer;
let source;
let nig = false;
chrome.browserAction.setBadgeText({text: 'OFF'})

chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
		if (msg.action === 'start') {
			if (!streamer) {
                audioCtx = new window.AudioContext({sampleRate: 48000});
				
                chrome.tabCapture.capture({  // this to avoid multiple captures
                    audio: true 
                }, function(stream) {
                    streamer = stream;
                    source = audioCtx.createMediaStreamSource(streamer);

					const splitter = audioCtx.createChannelSplitter(2);
					const merger = audioCtx.createChannelMerger(2);

					const leftDelay = audioCtx.createDelay();
					const rightDelay = audioCtx.createDelay();
					leftDelay.delayTime.value = 0;
					rightDelay.delayTime.value = 0.01;

					source.connect(splitter);

					splitter.connect(leftDelay, 0);
					splitter.connect(rightDelay, 1);

					leftDelay.connect(merger, 0, 0);
					rightDelay.connect(merger, 0, 1);

					merger.connect(audioCtx.destination);
					chrome.browserAction.setBadgeText({text: 'ON'})

					function psound() {
						//setTimeout(() => {
							if (rightDelay.delayTime.value <= 0.025) {
								rightDelay.delayTime.value += 0.001
								setTimeout(psound, 200)
							} else {
								rightDelay.delayTime.value = 0
								setTimeout(psound1, 200)
							}
						//}, 150);
					}

					function psound1() {
						//setTimeout(() => {
							if (leftDelay.delayTime.value <= 0.025) {
								leftDelay.delayTime.value += 0.001
								setTimeout(psound1, 200)
							} else {
								leftDelay.delayTime.value = 0
								setTimeout(psound, 200)
							
							}
						//}, 150);
					}

					setTimeout(() => {
						psound()
					}, 1000);

				
                });
            }
		}

       else if (msg.action === 'off') {
            streamer.getAudioTracks()[0].stop();
            streamer = null;
            audioCtx.close();
			chrome.browserAction.setBadgeText({text: 'OFF'})
        }
    });
});
