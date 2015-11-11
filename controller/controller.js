var X = 0;
var Y = 1;
var Z = 2;

var isPinched = false;

var setPinch = function (aHand) {
    isPinched = aHand.pinchStrength > 0.65;
};

var config = {
    speed : 10,
    xCalibration : 0.2,
    yCalibration : 0.0,
    minUpdateInterval : 0.017,
    enableVerticalScroll : true,
    enableHorizontalScroll : true,
    invertVerticalScroll : true,
    invertHorizontalScroll : false,
    enableCircleGestures : true,
    tabSwitchInterval : 500000,
    enableSwipeGestures : true
};

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

function isChromeUrl () {
    return new Promise(function (resolve, reject) {
        chrome.tabs.getSelected(function (tab) {
            if (tab.url.indexOf("chrome://") > -1 || tab.url.indexOf("chrome-extension://") > -1 || tab.url.indexOf("chrome-devtools://") > -1) {
                reject();
            } else {
                resolve(tab.id);
            }
        });
    });
}

function getNumExtendedFingers (frame) {
    var extenders = 0;

    for (var i = 0; i < frame.pointables.length; i++) {
        var obj = frame.pointables[i];
        if (obj.extended === true) {
            extenders += 1;
        }
    }
    return extenders;
}

function getOneHandWithCustomFingers(frame, numFingers) {
    return new Promise(function (resolve, reject) {
        if (frame.hands && frame.hands.length == 1 && getNumExtendedFingers(frame) >= numFingers) {
            resolve(frame.hands[0]);
        } else {
            reject();
        }
    });
}

function zoomFunc(new_zoomFactor) {
    chrome.tabs.getSelected(function (tab) {
        chrome.tabs.getZoom(tab.id, function (zoomFactor) {
            zoomFactor >= 0.3 && zoomFactor <= 5.0 ? chrome.tabs.setZoom(tab.id, zoomFactor + new_zoomFactor, function (tab) {
            }) : '';
        });
    });
}

var actions = {
    zoomIn: {
        exec: function zoomIn() {
            zoomFunc(-0.05);
        }
    },
    zoomOut: {
        exec: function zoomOut() {
            zoomFunc(0.05);
        }
    },
    zoom: {
        exec: function (frame, tab_id) {
            setPinch()
        }
    },
    scroll: {
        exec: function (frame, tab_id) {
            function axisValue(normalValue, calibration, invert) {
                return (-normalValue + calibration) * ( invert ? -1 : 1);
            }

            function speedFactor(enabled, axisValue) {
                return enabled ? Math.pow(Math.abs(axisValue) + 1, 4) : 0;
            }

            //console.log(getNumExtendedFingers(frame));

            if (frame.hands && frame.hands.length == 1 && getNumExtendedFingers(frame) >= 4) {
                var aHand = frame.hands[0];

                var x = axisValue(aHand.palmNormal[X], config.xCalibration, config.invertHorizontalScroll);
                var y = axisValue(aHand.palmNormal[Z], config.yCalibration, config.invertVerticalScroll);

                var lengthX = speedFactor(config.enableHorizontalScroll, x) * x * config.speed;
                var lengthY = speedFactor(config.enableVerticalScroll, y) * y * config.speed;

                lengthX = Math.abs(lengthX) > 1 ? lengthX : 0;
                lengthY = Math.abs(lengthY) > 2 ? lengthY : 0;

                chrome.tabs.executeScript(tab_id, {
                    code: "window.scrollBy(" + lengthX + ", " + lengthY + ");"
                }, function () {});
            }
        }
    },
    closeTab: {
        exec: function closeCurrentTab() {
            preProcessTabs(function (tabs, currentTab) {
                var numTabs = tabs.length;
                if (numTabs != 1) {
                    chrome.tabs.remove(currentTab.id, function () {
                    });
                }
            });
        }
    },
    newTab: {
        exec: function openNewTab() {
            chrome.tabs.create({}, function () {});
        }
    },
    previousTab: {
        exec: function previousTab() {
            preProcessTabs(function (tabs, currentTab) {
                var indexPreTab = currentTab.index > 0 ? currentTab.index - 1 : tabs.length - 1;
                chrome.tabs.highlight({tabs: indexPreTab}, function (tab) {
                });
            })
        }
    },
    nextTab: {
        exec: function nextTab() {
            preProcessTabs(function (tabs, currentTab) {
                var indexNextTab = currentTab.index < tabs.length - 1 ? currentTab.index + 1 : 0;
                chrome.tabs.highlight({tabs: indexNextTab}, function (tab) {
                });
            })
        }
    },
    historyForward: {
        exec: function historyForward() {
            chrome.tabs.executeScript({
                code: 'history.forward()'
            });
        }
    },
    historyBack: {
        exec: function historyBack() {
            chrome.tabs.executeScript({
                code: 'history.back()'
            });
        }
    },
    openExtensions: {
        exec: function openExtensions() {
            openNewTabWith("chrome://extensions/");
        }
    }
};






