chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
    switch(request.type) {
		case "close-tab":
			closeCurrentTab();
		break;
		case "zoom-in":
			zoomIn();
		break;
		case "zoom-out":
			zoomOut();
		break;
		case "browse-history":
			browseHistory();
		break;
		case "previous-tab":
			previousTab();
		break;
		case "next-tab":
			nextTab();
		break;
    }
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

function preProcessTabs(func) {
	if(func) {
		chrome.tabs.getAllInWindow(null, function(tabs) {
			chrome.tabs.getSelected(function(curTab) {
				func(tabs, curTab);
			});
		});
	}
}

function closeCurrentTab(){
	preProcessTabs(function (tabs, currentTab) {
		var numTabs = tabs.length;
		if (numTabs != 1){
			chrome.tabs.remove(currentTab.id, function() { });
		}else{
			//chrome.tabs.update(null);
		}
	});
}

function openNewTabwith(url){
	chrome.tabs.create({url: url});
}


function previousTab(){
	preProcessTabs(function (tabs, currentTab) {
		var indexPreTab = currentTab.index > 0 ? currentTab.index - 1 : tabs.length - 1;
		chrome.tabs.highlight({tabs: indexPreTab}, function (tab) {});
	})
}

function nextTab(){
	preProcessTabs(function (tabs, currentTab) {
		var indexNextTab = currentTab.index < tabs.length - 1 ? currentTab.index + 1 : 0;
		chrome.tabs.highlight({tabs: indexNextTab}, function (tab) {});
	})
}

function zoomIn(){
	chrome.tabs.getSelected(function(tab) {
		chrome.tabs.getZoom(tab.id, function (zoomFactor) {
			zoomFactor >= 0.3 ? chrome.tabs.setZoom(tab.id, zoomFactor - 0.05, function (tab) {}) : '';
		});
	});
}

function zoomOut(){
	chrome.tabs.getSelected(function(tab) {
		chrome.tabs.getZoom(tab.id, function (zoomFactor) {
			zoomFactor <= 5.0 ? chrome.tabs.setZoom(tab.id, zoomFactor + 0.05, function (tab) {}) : '';
		});
	});
}

function browseHistory(){
	openNewTabwith("chrome://history/");
}

function openSettings(){
	openNewTabwith("chrome://settings/");
}

function openExtensions(){
	openNewTabwith("chrome://extensions/");
}

function openDownloads(){
	openNewTabwith("chrome://downloads/");
}
