/* 

Tyler Reece
IT493 Independent Study
network.js

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

function removehttp(url) {
	return url.split("//")[1];
}


// ******************************************************************** //


/* Network Visualization */
// create an array with nodes
  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();

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
    nodes: nodes,
    edges: edges
  };
  
  var options = {
  	layout: {
  		randomSeed: 2,
  	},
  	nodes: {
  		brokenImage: "undefined.png",
  		font: {
  			multi: 'html',
  		},
  		shape: 'box',
  	},
  	edges: {
  		color: {
  			color: 'blue',
  		}
  	}
  };
  var network = new vis.Network(container, data, options);


  /* Empty Network */
  if(!nodes.length) {
  	nodes.add({id: 0, label: "Browse around to start Grokking!", image: '38.png', shape: 'image'});
  };


  // ********************************************************************** //


/* Event Handler */

var idCount = 1;
var secondaryConnections = {}; // 
var idToPrimary = {};

chrome.runtime.onConnect.addListener(function(port) {

	port.onMessage.addListener(function(Message) {

		var deets = Message.Details;
		//console.log(deets);
		//if(isPrimary(deets)) {
		//	deets = "PRIMARY: " + deets;
		//};
		//console.log(deets);
		

		// Testing purposes only //
		//console.log(Message.Details);
		//console.log(parse_url(Message.Details.url));
		
		if(isPrimary(deets)) { // ensures primary connections only
			if(deets.ip) { // ensures unique nodes only

				// remove intro message upon browsing start
				if(nodes.get(0)) {
					nodes.remove(0);
				};
				
				//console.log(deets);

				// debug
				//console.log(deets);

				// get url
				url = parse_url(deets.url).hostname;
				var time = new Date(Message.Details.timeStamp).toTimeString().slice(0, 8);
				//console.log(url);
				// if request is unique
				if(nodes.get({filter: sizeOne}).length == 0) { 
					nodes.add({id: idCount, label: "<b>" + url + "</b>", fromCache: deets.fromCache, ip: deets.ip, time: time, type: deets.type, image: 'https://' + url + '/favicon.ico', shape:'image'});
					idToPrimary[url] = idCount;
					idCount += 1;
					nodes.add({id: idCount, label: "JavaScript\n<b>0</b>", group: 0, number: 0}); // id + 1
					edges.add({to: idCount, from: idCount-1});
					idCount += 1;
					nodes.add({id: idCount, label: "Images\n<b>0</b>", group: 1, number: 0}); // id + 2
					edges.add({to: idCount, from: idCount-2});
					idCount += 1;
					nodes.add({id: idCount, label: "XmlHttpRequests\n<b>0</b>", group: 2, number: 0}); // id + 3
					edges.add({to: idCount, from: idCount-3});
					idCount += 1;
					nodes.add({id: idCount, label: "Fonts\n<b>0</b>", group: 3, number: 0}); // id + 4
					edges.add({to: idCount, from: idCount-4});
					idCount += 1;
					nodes.add({id: idCount, label: "Stylesheets\n<b>0</b>", group:4, number:0}); // id + 5
					edges.add({to: idCount, from: idCount-5});
					idCount += 1;
					nodes.add({id: idCount, label: "Media\n<b>0</b>", group: 5, number:0}); // id + 6
					edges.add({to: idCount, from: idCount-6});
					idCount += 1;
					nodes.add({id: idCount, label: "Other\n<b>0</b>", group: 6, number: 0}); // id + 7
					edges.add({to: idCount, from: idCount-7});
					idCount += 1;
					network.fit(); // resize on each addition to fit growth of network
					var ini = url; // store in dict
					secondaryConnections[ini] = []; // input initiator into groupDict
					idCount += 1; // increment idCount
					//console.log(groupDict);
					//console.log(idToPrimary);
				};

			};
		}

		else { // Secondary connection
			var type = deets.type;
			var ini = removehttp(deets.initiator);
			//console.log(deets);
			//console.log(currentNumber);
			if(ini in secondaryConnections) { // if primary connection this belongs to
				if(type == "script") {
					var currentNumber = nodes.get(idToPrimary[ini]+1).number;
					//console.log(currentNumber);
					nodes.update({id: idToPrimary[ini]+1, number: currentNumber+1, label: "JavaScript\n<b>" + String(currentNumber+1) + "</b>"});
				}
				if(type == "image") {
					var currentNumber = nodes.get(idToPrimary[ini]+2).number;
					nodes.update({id: idToPrimary[ini]+2, number: currentNumber+1, label: "Images\n<b>" + String(currentNumber+1) + "</b>"});
				}
				if(type == "xmlhttprequest") {
					var currentNumber = nodes.get(idToPrimary[ini]+3).number;
					nodes.update({id: idToPrimary[ini]+3, number: currentNumber+1, label:"XmlHttpRequests\n<b>" + String(currentNumber+1) + "</b>"});
				}
				if(type == "font") {
					var currentNumber = nodes.get(idToPrimary[ini]+4).number;
					nodes.update({id: idToPrimary[ini]+4, number: currentNumber+1, label:"Fonts\n<b>" + String(currentNumber+1) + "</b>"});
				}
				if(type == "stylesheet") {
					var currentNumber = nodes.get(idToPrimary[ini]+5).number;
					nodes.update({id: idToPrimary[ini]+5, number: currentNumber+1, label: "Stylesheets\n<b>" + String(currentNumber+1) + "</b>"});
				}
				if(type == "media") {
					var currentNumber = nodes.get(idToPrimary[ini]+6).number;
					nodes.update({id: idToPrimary[ini]+6, number: currentNumber+1, label: "Media\n<b>" + String(currentNumber+1) + "</b>"});
				}
				if(type == "other") {
					var currentNumber = nodes.get(idToPrimary[ini]+7).number;
					nodes.update({id: idToPrimary[ini]+7, number: currentNumber+1, label: "Other\n<b>" + String(currentNumber+1) + "</b>"});
				}
				secondaryConnections[ini].push(deets.url);
			};
			
		};
		

	});
});


/* Interactive Events */
network.on('click', function(properties) {
	var ids = properties.nodes;
	var clickedNodes = nodes.get(ids);
	var primaryConnection = clickedNodes[0].label;
	document.getElementById('info').innerHTML = 'Secondary Connections: ' + secondaryConnections[primaryConnection];
	document.getElementById('info').innerHTML = 'Number: ' + clickedNodes[0].number;
	//console.log('clicked nodes: ', clickedNodes)
});
