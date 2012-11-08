/**
 * AJAX_CLIENT.JS
 * an example of a JSONP request - an ajax request which returns a JSON object which can be directly referenced.
 * 
 * When a user browses to http://localhost:8000, index.html is loaded, which then loads this js file
 * to send a JSONP request to the server appliation in AJAX_SERVER.JS
 */

window.onload = function() {

    var url, 
        response,
        data,
        jqxhr;
        

    // Take care of some UI details
    var ajaxString = prompt("Enter the ajax string to follow the URL");     // Get user's nickname
    console.log("user entered: "+ajaxString );


    // If the browser does not support the XMLHttpRequest object, do nothing
    if (!window.XMLHttpRequest) return;
    
    // Encode the user's input as query parameters in a URL
    var url = document.URL+
              "?myparam="+ajaxString;
//             +"&callback=?"; // must add this string to get a JSONP response, where the JSON is surrounded by "fnc()""
    
    console.log("JSON API call URL = "+url );
    
    // send request as url
    jqxhr = $.getJSON( url, function(data) {
        // this status information is returned for all JSONP requests
        console.log("getJSON anonymous callback status="+jqxhr.status+" "+(jqxhr.status== 200? "OK":"fail") );
        console.log("getJSON anonymous callback statusText="+jqxhr.statusText);
        console.log( data );
        console.log("getJSON anonymous callback data.responseStatus="+data.responseStatus );
     
        // the example returns an object with two attributes: key1 and key2
        console.log(data["key1"]+" "+data["key2"]);
        
      } // anon callback function
    ); // getJSON()

    jqxhr.success(function(){ 
      console.log("getJSON success()");
    }); // success()
  
    jqxhr.error(function(){ 
      console.log("getJSON error()");
    }); // error()
  
    jqxhr.complete(function(){ 
      console.log("getJSON complete() jqxhr.status="+jqxhr.status+" "+(jqxhr.status== 200? "OK":"fail") );
      console.log("getJSON complete() jqxhr.statusText="+jqxhr.statusText);
    }); // complete;
  
  console.log("JSON API call sent asyncronously" );
}; 




