

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.popupOpen) {
        chrome.tabs.create({
            url: "totop.html",
            active: true
        });
    }
});
