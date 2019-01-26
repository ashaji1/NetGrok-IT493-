/* 

Tyler Reece
IT493 Independent Study
main.js

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

/*
function favicon(url) {
	favUrl = "https://www.google.com/s2/favicons?domain=" + url;
	return favUrl;
}
*/






// ******************************************************************** //





/* Network Visualization */
// create an array with nodes
  var nodes = new vis.DataSet();

/*
  // create an array with edges
  var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5},
    {from: 3, to: 3}
  ]);
*/

  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes
  };
  var options = {
  	randomSeed:2,
  };
  var network = new vis.Network(container, data, options);


  /* Empty Network */
  if(!nodes.length) {
  	nodes.add({id: 0, label: "Browse around to start Grokking!"});
  };


  // ********************************************************************** //


/* Event Handler */

chrome.runtime.onConnect.addListener(function(port) {

	port.onMessage.addListener(function(Message) {

		var deets = Message.Details;
		
		// remove intro message upon browsing start
		if(nodes.get(0)) {
			nodes.remove(0);
		};

		// Testing purposes only //
		//console.log(Message.Details);
		//console.log(parse_url(Message.Details.url));
		
		if(isPrimary(deets)) { // ensures primary connections only
			if(deets.ip) { // ensures unique nodes only
				

				// debug
				console.log(deets);

				// get url
				url = parse_url(deets.url).hostname;
				var time = new Date(Message.Details.timeStamp).toTimeString().slice(0, 8);
				console.log(url);
				// if request is unique
				if(nodes.get({filter: sizeOne}).length == 0) { 
					nodes.add({label: url, fromCache: deets.fromCache, ip: deets.ip, time: time, type: deets.type, image: 'https://' + url + '/favicon.ico', shape:'image'});
				};

				

				// if duplicate request
				//else {

				//}

			};
		};

		// resize on each request to fit growth of network
		network.fit();

	});
});


/* Interactive Events */
network.on('click', function(properties) {
	var ids = properties.nodes;
	var clickedNodes = nodes.get(ids);
	document.getElementById('info').innerHTML = 'Info: ' + JSON.stringify(clickedNodes);
	console.log('clicked nodes: ', clickedNodes)
});




