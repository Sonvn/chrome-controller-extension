chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    //switch(request.type) {
		//case "close-tab":
		//	closeCurrentTab();
		//break;
		//case "zoom-in":
		//	zoomIn();
		//break;
		//case "zoom-out":
		//	zoomOut();
		//break;
		//case "browse-history":
		//	browseHistory();
		//break;
		//case "previous-tab":
		//	previousTab();
		//break;
		//case "next-tab":
		//	nextTab();
		//break;
		//case "history-forward":
		//	historyForward();
		//break;
		//case "history-back":
		//	historyBack();
		//break;
    //}

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