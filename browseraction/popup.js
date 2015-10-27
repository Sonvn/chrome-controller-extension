var actions = {
	zoomIn: {
		nameMess: "zoom-in"
	},
	zoomOut: {
		nameMess: "zoom-out"
	},
	closeTab: {
		nameMess: "close-tab"
	},
	newTab: {
		nameMess: "new-tab"
	},
	browseHistory: {
		nameMess: "browse-history"
	}
};

window.onload = function() {
	for (var key in actions) {
		var obj = actions[key];

		(function(key, obj) {
			var keyName = key;
			document.getElementById(keyName).onclick = function() {
				console.log(keyName);

				chrome.extension.sendMessage({
					type: obj.nameMess
				});
			}
		})(key, obj);
	}
};