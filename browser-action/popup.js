window.onload = function() {
	for (var key in actions) {
		var obj = actions[key];

		(function(key, obj) {
			var keyName = key;
			document.getElementById(keyName).onclick = function() {
				chrome.extension.sendMessage({
					type: keyName
				});
			}
		})(key, obj);
	}
};