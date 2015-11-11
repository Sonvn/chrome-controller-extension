//var actions in file controller/controller.js
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    actions[request.type].exec();
    return true;
});

//chrome.extension.onConnect.addListener(function (port) {
//	console.log(port);
//    port.onMessage.addListener(function (message) {
//		console.log(message);
//       	switch(port.name) {
//			case "color-divs-port":
//				colorDivs();
//			break;
//		}
//    });
//});


//Leap.loop(function (frame) {
//    console.log(frame);
//});

var controller = new Leap.Controller({enableGestures: true})
    .use('screenPosition', {
        scale: 0.1
    })
    .connect()
    .on('frame', function (frame) {

        isChromeUrl()
            .then(function (tab_id) {
                actions.scroll.exec(frame, tab_id);
                actions.zoom.exec(frame, tab_id);

                //if(frame.valid && frame.gestures.length > 0){
                //    frame.gestures.forEach(function(gesture){
                //        switch (gesture.type){
                //            case "circle":
                //                console.log("Circle Gesture");
                //                break;
                //            case "keyTap":
                //                console.log("Key Tap Gesture");
                //                break;
                //            case "screenTap":
                //                console.log("Screen Tap Gesture");
                //                break;
                //            case "swipe":
                //                console.log("Swipe Gesture");
                //                break;
                //        }
                //    });
                //}
            })
            .catch(function() {
            });

    });
