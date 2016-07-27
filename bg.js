/*

#***************************************#
#		Twitch Buffering Fix v 1.1.1
#***************************************#
#	Author:		VixinG
#	Twitter:	twitter.com/VixinG_
#***************************************#
#
#	I am not affiliated with Twitch (Twitch.tv) whatsoever.
#	You agree to use this extension at your own risk.
#	This extension has been made for educational purposes only.
#
#***************************************#
#	If this extension helped you,
#	consider donating:
#	- https://www.twitchalerts.com/donate/vixing
#***************************************#

*/

var simple = false;

var using = 0;
var search = /vid.*hls.*(\/hls.*.ts)/;

var countries = {
	"def": "Default",
	"GL": "Global Server",
	"US": "United States",
	"SE": "Sweden",
	"UK": "United Kingdom",
	"NL": "Netherlands",
	"FR": "France",
	"DE": "Germany",
	"PL": "Poland",
	"CZ": "Czech Republic",
	"AU": "Australia",
	"AS": "Asia"
};

var replacements = [
	["def", "Default server", "none"],
	["GL-2", "Edgecast", "g1.edgecast.hls.ttvnw.net"],

	["US-1", "San Francisco", "video-edge-2ca3e4.sfo01.hls.ttvnw.net"],
	["US-2", "Seattle", "video-edge-7e8e10.sea01.hls.ttvnw.net"],
	["US-3", "San Jose", "video-edge-7e96ac.sjc01.hls.ttvnw.net"],
	["US-4", "Chicago", "video-edge-835140.ord02.hls.ttvnw.net"],
	["US-5", "Washington", "video20.iad02.hls.ttvnw.net"],
	["US-6", "New York", "video-edge-8fd0d8.jfk03.hls.ttvnw.net"],
	["US-7", "Los Angeles", "video20.lax01.hls.ttvnw.net"],
	["US-8", "Dallas", "video20.dfw01.hls.ttvnw.net"],
	["US-9", "Miami", "video-edge-7ea8a4.mia02.hls.ttvnw.net"],

	["SE", "Stockholm", "video-edge-69c1b0.arn01.hls.ttvnw.net"],

	["UK", "London", "video20.lhr02.hls.ttvnw.net"],

	["NL", "Amsterdam", "video20.ams01.hls.ttvnw.net"],

	["FR", "Paris", "video-edge-49b0d4.cdg01.hls.ttvnw.net"],

	["DE", "Frankfurt", "video-edge-748bd0.fra01.hls.ttvnw.net"],
	
	["PL", "Warsaw", "video-edge-8f9918.waw01.hls.ttvnw.net"],

	["CZ", "Prague", "video-edge-4ae010.prg01.hls.ttvnw.net"],
	
	["AU", "Sydney", "video-edge-8c6ee0.syd01.hls.ttvnw.net"],
	
	["AS-1", "HKG", "video-edge-7cf698.hkg01.hls.ttvnw.net"],
	["AS-2", "SEL", "video-edge-780e48.sel01.hls.ttvnw.net"],
	["AS-3", "TYO", "video-edge-7cfe50.tyo01.hls.ttvnw.net"]
];

var per_country = {};
for (var i = 0; i < replacements.length; i++) {
	var country = replacements[i][0].replace(/^([a-zA-Z]+).*$/,"$1");
	if (typeof per_country[country] == 'undefined') {
		per_country[country] = [];
	}
	per_country[country].push(i);
}

function updateButton() {
	var cluster = replacements[using][0];
	chrome.browserAction.setBadgeText({
		text: cluster.toString()
	});
}

function changeServer(id) {
	using = parseInt(id);
	chrome.storage.local.set({ 'server': using });
	updateButton();
}

function click() {
	if (using > replacements.length -2)
		using = 0
	else
		using += 1;
	updateButton();
}

function init() {
	chrome.webRequest.onBeforeRequest.addListener(
		function(info) {
			if (info.url.indexOf(".ts") > -1) {
				var conf;
				var subject = info.url;

				if (using == 0) {
					return {};
				}

				conf = replacements[using][2];
				subject = subject.replace(search, conf + "$1");

				if (subject !== info.url) {
					return {
						redirectUrl: subject
					};
				}
			} else
				return {};
		}, {
			urls: [
				"*://*/*"
			]
		}, ["blocking"]
	);

	updateButton();
}

function getStorage() {
    chrome.storage.local.get('server', function (data) {
        if (chrome.runtime.lasterror) {
            using = 0;
        }
        else {
            using = data.server;
            if (typeof using == 'undefined') {
                using = 0;
            }
        }
        init();
    });
}

function resimple() {
	if(simple) {
		chrome.contextMenus.update("toggle", {"title":"Simple Mode"});
		chrome.browserAction.setPopup({popup: "popup.html"});
		simple = false;
	}
	else {
		chrome.contextMenus.update("toggle", {"title":"List Mode"});
		chrome.browserAction.setPopup({popup: ""});
		simple = true;
	}
}

chrome.contextMenus.create({
	"id": "toggle",
	"title": "Simple Mode",
	"contexts": ["browser_action"],
	"onclick": resimple
});

chrome.browserAction.onClicked.addListener(click);

getStorage();
