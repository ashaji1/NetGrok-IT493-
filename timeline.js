/* 

Tyler Reece
IT493 Independent Study
timeline.js

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
  if(newMonth.length < 2) newMonth = '0' + newMonth;
  if(newDay.length < 2) newDay = '0' + newDay;
  if(newSec.length < 2) newSec = '0' + newSec; 
  if(newMin.length < 2) newMin ='0' + newMin;
  formatted += year + '-' + newMonth + '-' + newDay + 'T' + hour + ':' + newMin + ':' + newSec + '.' + ms;
  return formatted;
}


// DOM element where the Timeline will be attached
  var container = document.getElementById('timeline');

  // get current time
  var date = new Date();
  var year = String(date.getFullYear());
  var month = String(date.getMonth());
  var day = String(date.getDate());
  var hour = String(date.getHours());
  var min = String(date.getMinutes());
  var sec = String(date.getSeconds());
  var mil = String(date.getMilliseconds());

  // Create a DataSet (allows two way data-binding)
  var items = new vis.DataSet([
    {id: 1, content: 'Session start', start: formatFullDate(year, month, day, hour, min, sec, mil)},
  ]);
  console.log(formatFullDate(year, month, day, hour, min, sec, mil));

  // Configuration for the Timeline
  var options = {
    zoomMin:1,
    horizontalScroll: true,
    orientation: 'top',
    zoomKey: 'ctrlKey',
  };

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options);

// ************************************************************** // 

  /* Event Handler */

chrome.runtime.onConnect.addListener(function(port) {

  port.onMessage.addListener(function(Message) {

    var deets = Message.Details;
    
    

    // Testing purposes only //
    //console.log(Message.Details);
    //console.log(parse_url(Message.Details.url));
    
    if(isPrimary(deets)) { // ensures primary connections only
      if(deets.ip) { // ensures unique nodes only
        

        // debug
        console.log(deets);


        // get current time
        var date = new Date();
        var year = String(date.getFullYear());
        var month = String(date.getMonth());
        var day = String(date.getDate());
        var hour = String(date.getHours());
        var min = String(date.getMinutes());
        var sec = String(date.getSeconds());
        var mil = String(date.getMilliseconds());
        
        /*
        console.log('yr: ' + year);
        console.log('month: ' + month);
        console.log('day: ' + day);
        console.log('hr: ' + hour);
        console.log('min: ' + min);
        console.log('sec: ' + sec);
        console.log('mil: ' + mil);
        */
        //console.log(formatFullDate(year, month, day, hour, min, sec, mil));
        // '2015-01-23T14:00:00.200Z'

        // get url
        var url = parse_url(deets.url).hostname;

        var time = formatFullDate(year, month, day, hour, min, sec, mil);
        console.log(time);
        console.log(url);
        var cont = document.createElement('div');
        cont.appendChild(document.createTextNode(url));
        cont.appendChild(document.createElement('br'));
        var favicon = document.createElement('img');
        favicon.src = 'https://' + url + '/favicon.ico';
        favicon.style.width = '35px';
        favicon.style.height='35px';
        cont.appendChild(favicon);
        var request = {content: cont, fromCache: deets.fromCache, ip: deets.ip, start: time};//, image: 'https://' + url + '/favicon.ico', shape:'image'};
        console.log(request.start);
        items.add(request); //image: 'https://' + url + '/favicon.ico', shape:'image'});
        
      };
    };

    //else { // secondary connection

    //};

    
    

  });
});

