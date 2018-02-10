
var headerOptions = {
    'Referer': 'https://assistant.sogoucdn.com/v5/cheat-sheet',
    // 'User-Agent': 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C202 Sogousearch/Ios/5.9.7',
    'User-Agent': 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36 Sogousearch/Ios/5.9.7',
    'Cookie': 'APP-SGS-ID=' + Math.floor(100000 * Math.random())
};


chrome.webRequest.onBeforeSendHeaders.addListener(function(details)
{
    if (details.type === 'xmlhttprequest' &&  (details.url.indexOf('wdpush.sogoucdn.com/api/anspush') !== -1)) {
        var changed = {};

        for (var i = 0; i < details.requestHeaders.length; i++) {
            if (headerOptions[details.requestHeaders[i].name]) {
                details.requestHeaders[i].value = headerOptions[details.requestHeaders[i].name];
                changed[details.requestHeaders[i].name] = true;
            }
        }

        for(var i in headerOptions) {
            if (!changed[i]) {
                details.requestHeaders.push({name: i, value: headerOptions[i]});
            }
        }

        return {requestHeaders: details.requestHeaders};
    }
},

{urls: ['<all_urls>']},
['blocking', 'requestHeaders']
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.popupOpen) {
        chrome.tabs.create({
            url: "totop.html",
            active: true
        });
    }
});
