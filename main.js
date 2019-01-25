/* 

Tyler Reece
IT493 Independent Study
main.js

*/


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

function isUnique(details) {
	return true;
	//return !nodes.includes(details);
}

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
  };
  var network = new vis.Network(container, data, options);


/* Event Handler */

chrome.runtime.onConnect.addListener(function(port) {

	port.onMessage.addListener(function(Message) {

		// Testing purposes only //
		//console.log(Message.Details);
		//console.log(parse_url(Message.Details.url));
		
		if(isPrimary(Message.Details)) { // ensures primary connections only
			if(Message.Details.ip) { // ensures unique nodes only
				console.log(Message.Details)
				nodes.add({label: parse_url(Message.Details.url).hostname});
			};
		};
		network.fit();

	});
});





