debugger;

window.onload = function () {
    document.getElementsByTagName("BODY")[0].style.zoom = "100%";
};

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
        case "zoom-page":
            //console.log(message.value);
            document.getElementsByTagName('BODY')[0].style.zoom = message.value;
            break;
    }
});

