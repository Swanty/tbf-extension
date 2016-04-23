var bg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
	
// Google Analytics for my own curiousity
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
 
ga('create', 'UA-76783868-1', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('send', 'pageview', '/popup.html');
	
	document.body.onclick = function(e) {
		e = e.target;
		if (e.className && e.className.indexOf('server') != -1) {
			var id = e.getAttribute("data-id");
			bg.changeServer(id);

			document.getElementsByClassName('server--selected')[0].classList.remove('server--selected');
			e.classList.add('server--selected');
		}
	}
	
	document.getElementById("twitch").addEventListener("click",function(){
		ga('send', 'event', 'Twitch', 'click');
	});

	document.getElementById("social").addEventListener("click",function(){
		ga('send', 'event', 'Twitter', 'click');
	});

	document.getElementById("beer").addEventListener("click",function(){
		ga('send', 'event', 'Beer', 'click');
	});

	var html = '';
	for (var key in bg.per_country) {
		var servers = bg.per_country[key];
		for (var i = 0; i < servers.length; i++) {
			if (i == 0) {
				html += '<div class="country">' + bg.countries[key.replace(/^([a-zA-Z]+).*$/,"$1")] + '</div>';
			}

			html += '<div class="server ' + (bg.using == servers[i] ? 'server--selected' : '') + '" data-id="' + servers[i] + '">- ' + bg.replacements[servers[i]][1] + '</div>';
		}
	};
	document.getElementById('content').insertAdjacentHTML('afterbegin', html);
});