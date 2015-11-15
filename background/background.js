//var actions in file controller/controller.js
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    actions[request.type].exec();
    return true;
});

var actionSwipe;

var controller = new Leap.Controller({enableGestures: true})
    .connect()
    .on('frame', function (frame) {
        if (frame.valid && frame.gestures.length > 0) {
            frame.gestures.forEach(function (gesture) {
                if (gesture.state == "stop" && frame.hands && frame.hands.length == 1) switch (gesture.type) {
                    case "swipe":
                        var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                        if (isHorizontal && getNumExtendedFingers(frame) == 1) {
                            if (gesture.direction[0] > 0) {
                                actionSwipe = actions.nextTab;
                            } else {
                                actionSwipe = actions.previousTab;
                            }
                        } else {
                            if (gesture.direction[1] > 0) {
                                actionSwipe = getNumExtendedFingers(frame) == 2 ? actions.newTab : null;
                            } else {
                                if (getNumExtendedFingers(frame) == 2) {
                                    actionSwipe = actions.closeTab;
                                } else if (getNumExtendedFingers(frame) == 3) {
                                    actionSwipe = actions.reloadTab;
                                } else {
                                    actionSwipe = null
                                }
                            }
                        }
                        throttle(function () {
                            if(actionSwipe) actionSwipe();
                        }, 1000)();
                        break;
                }
            });
        }
    });