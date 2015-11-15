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

                if (frame.valid && frame.gestures.length > 0) {
                    frame.gestures.forEach(function (gesture) {
                        if (gesture.state == "stop") switch (gesture.type) {
                            case "circle":
                                var clockwise = false;
                                var pointableID = gesture.pointableIds[0];
                                var direction = frame.pointable(pointableID).direction;
                                var dotProduct = Leap.vec3.dot(direction, gesture.normal);

                                if (dotProduct > 0 && getNumExtendedFingers(frame) == 1) {
                                    actions.historyForward.exec();
                                } else {
                                    actions.historyBack.exec();
                                }

                                break;
                            case "keyTap":
                                //console.log("Key Tap Gesture");
                                break;
                            case "screenTap":
                                break;
                            case "swipe":
                                //console.log("Swipe Gesture");

                                //Classify swipe as either horizontal or vertical
                                var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                                if (isHorizontal && getNumExtendedFingers(frame) == 1) {
                                    if (gesture.direction[0] > 0) {
                                        swipeDirection = "right";
                                        actions.nextTab.exec();
                                    } else {
                                        swipeDirection = "left";
                                        actions.previousTab.exec();

                                    }
                                } else {
                                    if (gesture.direction[1] > 0) {
                                        swipeDirection = "up";
                                        getNumExtendedFingers(frame) == 2 ? actions.newTab.exec() : '';
                                    } else {
                                        swipeDirection = "down";
                                        if (getNumExtendedFingers(frame) == 2) {
                                            actions.closeTab.exec();
                                        } else if (getNumExtendedFingers(frame) == 3) {
                                            actions.reloadTab.exec();
                                        }
                                    }
                                }

                                console.log(swipeDirection);
                                break;
                        }
                    });
                }
            })
            .catch(function () {
            });

    });
