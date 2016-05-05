//trim the space chars.
function trim(chars) {
    return (chars || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
}


//parse the json object.
function parseJSON(jsonData) {
    //check if the input data is json-object.
    if (typeof jsonData === 'object') {  
        return jsonData;
    }

    //check if the original json-parse function is exists, then use it rightnow.
    if (window.JSON && window.JSON.parse) {
        return window.JSON.parse(jsonData);
    }

    if (typeof jsonData === "string") {
        jsonData = this.trim(jsonData);

        //check if the jsonData isn't a empty string.
        if (jsonData) {
            //construct the json object using the property of Function.
            return (new Function("return " + jsonData))();  
        }
    }
}


function AsynchrousHttpRequest(options) {
    //check if the url is exist.
    if (!options || !options.url) {
        return false;
    }
  
    //initilize the options data.
    options.data = options.data || "";  //the data to be send.
    options.method = (options.method || "GET").toUpperCase();  //request method.
    options.async = options.async || true;  //execute asychrous or not.

    //set the response type.
    options.responseType = options.responseType || (/xml/.test(options.url) ? "xml" : "json");
    //set the response callback.
    options.successCall = options.successCall || false;
    options.failureCall = options.failureCall || false;

    var xmlhttp;
    // code for IE7+, Firefox, Chrome, Opera, Safari etc.
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    //IE6, IE5
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //set the xmlHttpRequest response callback.
    xmlhttp.onreadystatechange = function () {
        //check if the response is succeed.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
        {
            if (options.successCall) {
                options.successCall(getResponseData(xmlhttp, options.responseType));
            }
        }
        //check if the response is failed.
        if (xmlhttp.readyState == 4 && xmlhttp.status != 200) { 
            if (options.failureCall) {
                options.failureCall(xmlhttp, xmlhttp.status); 
            }
        }
    }

    //create and send httpRequest to server.
    xmlhttp.open(options.method, options.url + (options.method == "GET" ? "?" + options.data : ""), options.async);
    if (options.method != "GET" && options.data) {
        xmlhttp.send(options.data);
    } else {
        xmlhttp.send();
    }
    return true; 
}


//parse the httpRequest response data.
function getResponseData(xmlhttp, type) {
    var resData = xmlhttp.responseText; 

    if (type === "json") {
        return parseJSON(resData);
    }

    if (type === "xml") {
        return xmlhttp.responseXML; 
    }

    if (type === "text") {
        return resData;
    }
}