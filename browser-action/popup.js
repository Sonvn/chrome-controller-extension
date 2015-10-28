window.onload = function() {
	for (var key in actions) {
		var obj = actions[key];

		(function(key, obj) {
			var keyName = key;
			var elementById = document.getElementById(keyName);
			if(elementById) {
				elementById.onclick = function() {
					chrome.extension.sendMessage({
						type: keyName
					});
				}
			}
		})(key, obj);
	}

	document.getElementById("openOptionPage").onclick = function() {
		var opts = chrome.extension.getURL('../option-page/option.html');
		console.log(opts);
		actions.newTabWithUrl.exec(opts);
	}
};