var X = 0;
var Y = 1;
var Z = 2;

var pinch = {
    isPinched: false,
    prevPinch: false,
    doingPinch: false
};

var z = {
    prevFrame: 0,
    currentFrame: 0
};

var config = {
    speed: 10,
    xCalibration: 0.0,
    yCalibration: 0.0,
    minUpdateInterval: 0.017,
    enableVerticalScroll: true,
    enableHorizontalScroll: true,
    invertVerticalScroll: true,
    invertHorizontalScroll: false,
    enableCircleGestures: true,
    tabSwitchInterval: 500000,
    enableSwipeGestures: true
};

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

function preProcessTabs(func) {
    if (func) {
        chrome.tabs.getAllInWindow(null, function (tabs) {
            chrome.tabs.getSelected(function (curTab) {
                func(tabs, curTab);
            });
        });
    }
}

function openNewTabWith(url) {
    chrome.tabs.create({url: url});
}

function getNumExtendedFingers(frame) {
    var extenders = 0;
    for (var i = 0; i < frame.pointables.length; i++) {
        var obj = frame.pointables[i];
        if (obj.extended === true) {
            extenders += 1;
        }
    }
    return extenders;
}

function isOneHand(frame) {
    return frame.hands && frame.hands.length == 1;
}

var actions = {
    zoom: function (frame) {
        var setPinch = function (aHand) {
            pinch.prevPinch = pinch.isPinched;
            pinch.isPinched = aHand.grabStrength > 0.95;

            if (pinch.prevPinch != pinch.isPinched) {
                pinch.doingPinch = !pinch.doingPinch;
            }
        };

        if (frame.hands && frame.hands.length == 1 && getNumExtendedFingers(frame) == 0) {
            var hand = frame.hands[0];
            setPinch(hand);
            if (pinch.isPinched) {
                var zPosition = hand.screenPosition()[Z];
                z.prevFrame = pinch.prevPinch != pinch.isPinched ? zPosition : z.currentFrame;
                z.currentFrame = zPosition;
                var diff = (z.currentFrame - z.prevFrame).toPrecision(1) * 0.05;
                if (Math.abs(diff) > 0 && Math.abs(diff) < 4) {
                    throttle(function () {
                        var currentZoom = parseFloat(document.getElementsByTagName('BODY')[0].style.zoom);
                        currentZoom = diff > 0 ? currentZoom + 2 : currentZoom - 2;
                        document.getElementsByTagName('BODY')[0].style.zoom = currentZoom + "%";
                    }, 500)();
                }
            }
        }
    },
    scroll: function (frame, tab_id) {
        function axisValue(normalValue, calibration, invert) {
            return (-normalValue + calibration) * ( invert ? -1 : 1);
        }

        function speedFactor(enabled, axisValue) {
            return enabled ? Math.pow(Math.abs(axisValue) + 1, 4) : 0;
        }

        if (isOneHand(frame) && getNumExtendedFingers(frame) == 5) {
            var aHand = frame.hands[0];

            var x = axisValue(aHand.palmNormal[X], config.xCalibration, config.invertHorizontalScroll);
            var y = axisValue(aHand.palmNormal[Z], config.yCalibration, config.invertVerticalScroll);

            var lengthX = speedFactor(config.enableHorizontalScroll, x) * x * config.speed;
            var lengthY = speedFactor(config.enableVerticalScroll, y) * y * config.speed;

            lengthX = Math.abs(lengthX) > 1 ? lengthX : 0;
            lengthY = Math.abs(lengthY) > 2 ? lengthY : 0;

            window.scrollBy(lengthX, lengthY);
        }
    },
    closeTab: function closeCurrentTab() {
        preProcessTabs(function (tabs, currentTab) {
            var numTabs = tabs.length;
            if (numTabs != 1) {
                chrome.tabs.remove(currentTab.id, function () {
                });
            }
        });
    },
    newTab: function openNewTab() {
        openNewTabWith("about:blank");
    },
    newTabWithUrl: {
        exec: function (url) {
            openNewTabWith(url);
        }
    },
    previousTab: function () {
        preProcessTabs(function (tabs, currentTab) {
            var indexPreTab = currentTab.index > 0 ? currentTab.index - 1 : tabs.length - 1;
            chrome.tabs.highlight({tabs: indexPreTab}, function (tab) {
            });
        })
    },
    nextTab: function () {
        preProcessTabs(function (tabs, currentTab) {
            var indexNextTab = currentTab.index < tabs.length - 1 ? currentTab.index + 1 : 0;
            chrome.tabs.highlight({tabs: indexNextTab}, function (tab) {
            });
        })
    },
    reloadTab: function nextTab() {
        preProcessTabs(function (tabs, currentTab) {
            var numTabs = tabs.length;
            chrome.tabs.reload(currentTab.id, function () {
            });
        })
    },
    historyForward: function () {
        history.forward();
    },
    historyBack: function () {
        history.back();
    },
    openExtensions: {
        exec: function () {
            openNewTabWith("chrome://extensions/");
        }
    }
};






