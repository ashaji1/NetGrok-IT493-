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
	return item.title == item.url;
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
  	interaction: {
  		hover: true,
  		hideEdgesOnDrag: true,
  	},
  	physics: {
  		stabilization: true,
  		adaptiveTimestep: true,
  	},
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
  			color: '#D3D3D3',
  		},
  		width: 0.5,
  		length: 5,
  	}
  };
  var network = new vis.Network(container, data, options);


  /* Empty Network */
  if(!nodes.length) {
  	nodes.add({id: 0, label: "<b>Browse around to start Grokking!</b>", image: '128.png', size: 60, shape: 'image', title: "Hi there! I'm the Scruffy Puppy!"});
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
				console.log(nodes._data);
				if(!(JSON.stringify(nodes._data)).includes(url)) {
					nodes.add({id: idCount, title: "<b>" + url + "</b>", fromCache: deets.fromCache, ip: deets.ip, time: time, type: deets.type, image: 'https://' + url + '/favicon.ico', shape:'image', url: 'https://' + url});
					idToPrimary[url] = idCount;
					idCount += 1;
					nodes.add({id: idCount, label: "JavaScript\n<b>0</b>", group: 0, number: 0, title: "All externally linked JavaScript files loaded by web browsers to display dynamic, interactive web pages", urls: [], url: url, hidden: true}); // id + 1
					edges.add({to: idCount, from: idCount-1});
					idCount += 1;
					nodes.add({id: idCount, label: "Images\n<b>0</b>", group: 1, number: 0, title: "All loaded images (.jpg, .png, .gif)", urls: [], url: url, hidden: true}); // id + 2
					edges.add({to: idCount, from: idCount-2});
					idCount += 1;
					nodes.add({id: idCount, label: "XmlHttpRequests\n<b>0</b>", group: 2, number: 0, title: "XHR objects that interact with servers to retrieve data without a full page refresh", urls: [], url: url, hidden: true}); // id + 3
					edges.add({to: idCount, from: idCount-3});
					idCount += 1;
					nodes.add({id: idCount, label: "Fonts\n<b>0</b>", group: 3, number: 0, title: "Specialized, external fonts loaded by websites", urls: [], url: url, hidden: true}); // id + 4
					edges.add({to: idCount, from: idCount-4});
					idCount += 1;
					nodes.add({id: idCount, label: "Stylesheets\n<b>0</b>", group:4, number: 0, title: "CSS stylesheets that provide color, layout, and fonts", urls: [], url: url, hidden: true}); // id + 5
					edges.add({to: idCount, from: idCount-5});
					idCount += 1;
					nodes.add({id: idCount, label: "Media\n<b>0</b>", group: 5, number: 0, title: "External video and audio linked by webpages", urls: [], url: url, hidden: true}); // id + 6
					edges.add({to: idCount, from: idCount-6});
					idCount += 1;
					nodes.add({id: idCount, label: "Other\n<b>0</b>", group: 6, number: 0, title:"Other requests, such as database fetches", urls: [], url: url, hidden: true}); // id + 7
					edges.add({to: idCount, from: idCount-7});
					idCount += 1;
					network.fit(); // resize on each addition to fit growth of network
					//network.stabilize(); // stabilize the network immediately - add as an option later!
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
					var newUrls = nodes.get(idToPrimary[ini]+1).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+1, number: currentNumber+1, label: "JavaScript\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				if(type == "image") {
					var currentNumber = nodes.get(idToPrimary[ini]+2).number;
					var newUrls = nodes.get(idToPrimary[ini]+2).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+2, number: currentNumber+1, label: "Images\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				if(type == "xmlhttprequest") {
					var currentNumber = nodes.get(idToPrimary[ini]+3).number;
					var newUrls = nodes.get(idToPrimary[ini]+3).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+3, number: currentNumber+1, label:"XmlHttpRequests\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				if(type == "font") {
					var currentNumber = nodes.get(idToPrimary[ini]+4).number;
					var newUrls = nodes.get(idToPrimary[ini]+4).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+4, number: currentNumber+1, label:"Fonts\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				if(type == "stylesheet") {
					var currentNumber = nodes.get(idToPrimary[ini]+5).number;
					var newUrls = nodes.get(idToPrimary[ini]+5).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+5, number: currentNumber+1, label: "Stylesheets\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				if(type == "media") {
					var currentNumber = nodes.get(idToPrimary[ini]+6).number;
					var newUrls = nodes.get(idToPrimary[ini]+6).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+6, number: currentNumber+1, label: "Media\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				if(type == "other") {
					var currentNumber = nodes.get(idToPrimary[ini]+7).number;
					var newUrls = nodes.get(idToPrimary[ini]+7).urls;
					newUrls.push(deets.url);
					nodes.update({id: idToPrimary[ini]+7, number: currentNumber+1, label: "Other\n<b>" + String(currentNumber+1) + "</b>", urls: newUrls, ini: ini});
				}
				secondaryConnections[ini].push(deets.url);
			};
			
		};
		

	});
});


/* Interactive Events */
/*network.on('click', function(properties) {
	var ids = properties.nodes;
	var clickedNodes = nodes.get(ids);
	console.log(clickedNodes[0].id);
	if(clickedNodes[0].urls) { // if secondary connection
		var urls = clickedNodes[0].urls;
		//document.getElementById('info').innerHTML = 'Secondary Connections: ' + secondaryConnections[primaryConnection];
		var table = "";
		for(var i=0; i<urls.length;i++) {
			table += '<p><a href="' + urls[i] +'" target="_blank">' + urls[i] + '</a></p>';
		};
		console.log(table);
		document.getElementById('info').innerHTML = table;
		//console.log('clicked nodes: ', clickedNodes)
	}
	//else {
	//	var urlToOpen = clickedNodes[0].url; // url of primary connection
	//	window.open(urlToOpen);
	//	console.log(urlToOpen);
	//}
});*/

network.on("hoverNode", function(properties) {
	var hoveredNodes = nodes.get(properties.node);
	console.log(hoveredNodes);
	var ini = removehttp(hoveredNodes.url);
	var jsNode = nodes.get(idToPrimary[ini]+1);
	var xmlNode = nodes.get(idToPrimary[ini]+2);
	var styleNode = nodes.get(idToPrimary[ini]+3);
	var fontNode = nodes.get(idToPrimary[ini]+4);
	var imageNode = nodes.get(idToPrimary[ini]+5);
	var mediaNode = nodes.get(idToPrimary[ini]+6);
	var otherNode = nodes.get(idToPrimary[ini]+7);
	//console.log(nodesToHide);
	jsNode.hidden = false;
	xmlNode.hidden = false;
	imageNode.hidden = false;
	fontNode.hidden = false;
	styleNode.hidden = false;
	mediaNode.hidden = false;
	otherNode.hidden = false;
	nodes.update(jsNode);
	nodes.update(xmlNode);
	nodes.update(imageNode);
	nodes.update(fontNode);
	nodes.update(styleNode);
	nodes.update(mediaNode);
	nodes.update(otherNode);
});

network.on("blurNode", function(properties) {
	var hoveredNodes = nodes.get(properties.node);
	var ini = removehttp(hoveredNodes.url);
	var jsNode = nodes.get(idToPrimary[ini]+1);
	var xmlNode = nodes.get(idToPrimary[ini]+2);
	var styleNode = nodes.get(idToPrimary[ini]+3);
	var fontNode = nodes.get(idToPrimary[ini]+4);
	var imageNode = nodes.get(idToPrimary[ini]+5);
	var mediaNode = nodes.get(idToPrimary[ini]+6);
	var otherNode = nodes.get(idToPrimary[ini]+7);
	//console.log(nodesToHide);
	jsNode.hidden = true;
	xmlNode.hidden = true;
	imageNode.hidden = true;
	fontNode.hidden = true;
	styleNode.hidden = true;
	mediaNode.hidden = true;
	otherNode.hidden = true;
	nodes.update(jsNode);
	nodes.update(xmlNode);
	nodes.update(imageNode);
	nodes.update(fontNode);
	nodes.update(styleNode);
	nodes.update(mediaNode);
	nodes.update(otherNode);
});


document.oncontextmenu = function() {
    return false;
}