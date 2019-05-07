/* 

Tyler Reece
IT493 Independent Study
timeline.js

*/

// ****************************************************** //


/* FUNCTIONS */

var server = "http://10.19.89.5:5000/data";

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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//'2015-01-23T14:00:00.200Z'
function formatFullDate(year, month, day, hour, min, sec, ms) {
  var formatted = '';
  var newMonth = month + 1;
  var newDay = day;
  var newSec = sec;
  var newMin = min;
  if(newMonth.length < 2) newMonth = '0' + String(newMonth);
  if(newDay.length < 2) newDay = '0' + String(newDay);
  if(newSec.length < 2) newSec = '0' + String(newSec); 
  if(newMin.length < 2) newMin ='0' + String(newMin);
  formatted += year + '-' + newMonth + '-' + newDay + 'T' + hour + ':' + newMin + ':' + newSec + '.' + ms;
  return formatted;
}


// DOM element where the Timeline will be attached
  var container = document.getElementById('timeline');

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: '<b>Session start</b>', start: new Date()},
  ]);

  // Configuration for the Timeline
  var options = {
    zoomMin:1,
    horizontalScroll: true,
    orientation: 'top',
    zoomKey: 'ctrlKey',
  };

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options);

  timeline.setWindow((new Date().setMinutes(new Date().getMinutes()-10)), (new Date().setMinutes(new Date().getMinutes()+10)));

// ************************************************************** // 

  /* Event Handler */

chrome.runtime.onConnect.addListener(function(port) {

  port.onMessage.addListener(function(Message) {

    var deets = Message.Details;
    if(deets.method != 'POST') $.post(server, {data: JSON.stringify(deets)});
    
    if(isPrimary(deets)) { // ensures primary connections only
      if(deets.ip) { // ensures unique nodes only

        // get url
        var url = parse_url(deets.url).hostname;

        var cont = document.createElement('div');
        var boldText = document.createElement('b');
        boldText.appendChild(document.createTextNode(url));
        cont.appendChild(boldText);
        cont.appendChild(document.createElement('br'));
        var favicon = document.createElement('img');
        favicon.src = 'https://' + url + '/favicon.ico';
        favicon.style.width = '35px';
        favicon.style.height='35px';
        cont.appendChild(favicon);
        var request = {content: cont, fromCache: deets.fromCache, ip: deets.ip, start: new Date()};
        console.log(request.start);
        items.add(request); 
        
      };
    };

  });
});

