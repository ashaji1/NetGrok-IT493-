/* 

Tyler Reece
IT493 Independent Study
chart.js

*/

// ****************************************************** //


/* FUNCTIONS */

function parse_url(url) {

	var parser = document.createElement('a');
	parser.href = url;

/*
	parser.protocol; // => "http:"
	parser.host;     // => "example.com:3000"
	parser.hostname; // => "example.com"
	parser.port;     // => "3000"
	parser.pathname; // => "/pathname/"
	parser.hash;     // => "#hash"
	parser.search;   // => "?search=test"
*/

	return parser;
}

function isPrimary(details) {

	var jsonString = JSON.stringify(details);
	return jsonString.includes("main_frame");
}


function sizeOne (item) {
	return item.label == url;
}


// ******************************************************************** //



  // ********************************************************************** //


/* Event Handler */

chrome.runtime.onConnect.addListener(function(port) {

	port.onMessage.addListener(function(Message) {

		var deets = Message.Details;
		
		if(isPrimary(deets)) { // ensures primary connections only
			if(deets.ip) { // ensures unique nodes only

				// remove intro message upon browsing start
				//console.log(chart);
	
				
				// get url
				url = parse_url(deets.url).hostname;
				var time = new Date(Message.Details.timeStamp).toTimeString().slice(0, 8);
	 
				//nodes.add({label: url, fromCache: deets.fromCache, ip: deets.ip, time: time, type: deets.type, image: 'https://' + url + '/favicon.ico', shape:'image'});
				//network.fit(); // resize on each addition to fit growth of network
				};
			};
				
	});
});

