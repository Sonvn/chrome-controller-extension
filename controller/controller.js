function preProcessTabs(func) {
    if (func) {
        chrome.tabs.getAllInWindow(null, function (tabs) {
            chrome.tabs.getSelected(function (curTab) {
                func(tabs, curTab);
            });
        });
    }
}

function openNewTabwith(url) {
    chrome.tabs.create({url: url});
}

var actions = {
    zoomIn: {
        exec: function zoomIn() {
            chrome.tabs.getSelected(function (tab) {
                chrome.tabs.getZoom(tab.id, function (zoomFactor) {
                    zoomFactor >= 0.3 ? chrome.tabs.setZoom(tab.id, zoomFactor - 0.05, function (tab) {
                    }) : '';
                });
            });
        }
    },
    zoomOut: {
        exec: function zoomOut() {
            chrome.tabs.getSelected(function (tab) {
                chrome.tabs.getZoom(tab.id, function (zoomFactor) {
                    zoomFactor <= 5.0 ? chrome.tabs.setZoom(tab.id, zoomFactor + 0.05, function (tab) {
                    }) : '';
                });
            });
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
    browseHistory: {
        exec: function browseHistory() {
            openNewTabwith("chrome://history/");
        }
    },
    openSettings: {
        exec: function openSettings() {
            openNewTabwith("chrome://settings/");
        }
    },
    openExtensions: {
        exec: function openExtensions() {
            openNewTabwith("chrome://extensions/");
        }
    },
    openDownloads: {
        exec: function openDownloads() {
            openNewTabwith("chrome://downloads/");
        }
    }


};






