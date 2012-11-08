/**
 * AJAX_SERVER.JS
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */


// This is server-side JavaScript, intended to be run with NodeJS.
// It implements a very simple, completely anonymous chat room.
// POST new messages to /chat, or GET a text/event-stream of messages
// from the same URL. Making a GET request to / returns a simple HTML file
// that contains the client-side chat UI.
var http = require('http');  // NodeJS HTTP server API

// The HTML file for the chat client. Used below.
var clientui = require('fs').readFileSync("index.html");
var client = null;

/// a dummy object we will return on an ajax request
var JSONobject = {"key1":"this object is", "key2":"the correct response", "input":null };

// Create a new server
var server = new http.Server();  

// When the server gets a new request, run this function
server.on("request", function (request, response) {

    // Parse the requested URL
    var url = require('url').parse(request.url);
    

    console.log(request.method+" request for pathname= "+url.pathname);
    console.log("href= "+url.href);
    console.log("search= "+url.search);
    console.log("query= "+url.query);
    
    // If the request starts with "/js", then index.html is just loading one of our javascript files so send that javascript.
    if (url.pathname.slice(0,3) === "/js") {  
        response.writeHead(200, {
          "Content-Type": "text/html"      
        });
        
        console.log("got a request for /js/"+url.pathname.slice(4));
        
        response.write(require('fs').readFileSync("js/"+url.pathname.slice(4)));
        response.end();
        return;
    }
    
    // If the request is just for "/" then its a request for index.html. so send it.
    if ((url.pathname === "/") && (!url.query)){  
        console.log("its a / so an implied request for index.html");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write( clientui );
        response.end();
        return;
    }
    
    // Send 404 for any other unrecognised request - i.e. where there is no "?..." after the pathname
    if (!url.query) {
        console.log("404: its an unrecognised request");
        response.writeHead(404);
        response.end();
        return;
    }

    // else there is a "?..." string after the pathname, meaning its an ajax request
    // If the request was a post, then a client is posting something
    if (request.method === "POST") {
        console.log("POST received");
        
        request.setEncoding("utf8");
        var body = "";
        // When we get a chunk of data, add it to the body
        request.on("data", function(chunk) { body += chunk; });

        // When the request is done, send an empty response 
        request.on("end", function() {
            response.writeHead(200);   // Respond to the request
            response.end();
            // now do something with the data the client has posted
            // ...
        });
    }
    // Otherwise, a client wants to GET a JSON object 
    else {
        console.log("GET received ("+request.method+")");
        
        // Parse the request for arguments and store them in query variable.
        // This function parses the url from request and returns object representation.
        var query = require('querystring').parse(url.query);
        // in this example, user entered text is appended to the url as "?myparam=XXX"
        console.log("myparam="+ query["myparam"]);
        // copy the user entered text into the 3rd attribute of the JSON response object
        JSONobject["input"] = query["myparam"];
        // convert the JSON object into a string to send to client
        JSONstring = JSON.stringify( JSONobject );

        // Set the content type and send an initial message event 
        response.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Length": JSONstring.length.toString()
        });
        
        // now send the stringified object 
        response.write( JSONstring );
        console.log("sent "+JSONstring );
        
        // always have to call end() to terminate the send
        response.end();
    }
});

// Run the server on port 8000. Connect to http://localhost:8000/ to use it.
server.listen(8000);


