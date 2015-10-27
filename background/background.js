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

function closeCurrentTab(){
	chrome.tabs.getAllInWindow(null, function(tabs) {
		var numTabs = tabs.length;
		if (numTabs != 1){
			chrome.tabs.getSelected(function(tab) {
				chrome.tabs.remove(tab.id, function() { });
			});
		}else{
			chrome.tabs.update(null);
		}
	});
}

function openNewTabwith(url){
	chrome.tabs.create({url: url});
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

