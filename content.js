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


var controller = new Leap.Controller({enableGestures: true})
    .use('screenPosition', {
        scale: 0.1
    })
    .connect()
    .on('frame', function (frame) {

        
    });
