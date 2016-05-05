/// <reference path="../App.js" />

(function () {
    "use strict";
    //Edit the loading code here to initial the app.
    var script = document.createElement("script");
    script.setAttribute("src",
       "//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {

        $(document).ready(function () {
            app.initialize();

            $('#Select-and-insert-image').click(SelectAndInsertTheImage);
            $('#search-image').click(SearchAndInsertTheImage);
        });
    };

    // Reads data from current document selection and displays a notification
    function getDataFromSelection() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    return result.value;
                } else {
                    return "false";
                }
            }
        );
    }


    //Convert the image to base64 coding.
    function convertImgToDataURLviaCanvas(imageUrl, outputFormat) {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function () {
            var drawing = document.createElement('CANVAS');
            if (drawing.getContext) {
                var context = drawing.getContext("2d");
                context.drawImage(image,0,0);
                var dataUrl = drawing.toDataURL(outputFormat);
                drawing = null;
                return dataUrl;
            }
        }
        image.src = imageUrl;
    }


    //Insert picture into current document selection.
    function writeHtmlData(imageUrl) {
        var insertImage = document.createElement('img');
        insertImage.src = imageUrl;

        insertImage.onload = function () {
            insertImage.width = 200 * insertImage.width / insertImage.height;
            insertImage.height = 200;

            var htmlDoc = insertImage.outerHTML;

            Office.context.document.setSelectedDataAsync(htmlDoc, {
                coercionType: Office.CoercionType.Html,
            }, function (asyncResult) {
                if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                    console.log('Error: ' + asyncResult.error.message);
                }
                else
                    console.log('Succeed');
            });
        };
    }


    //Insert picture into current document using image.
    function writeImageData(imageUrl) {
        var dataBase64Str = convertImgToDataURLviaCanvas(imageUrl);

        Office.context.document.setSelectedDataAsync(dataBase64Str, {
            coercionType: Office.CoercionType.Image,
            imageLeft: 50,
            imageTop: 50,

        },
        function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                console.log("Action failed with error: " + asyncResult.error.message);
            }
            else
                console.log("succeed!");
        });
    }


    //Select and insert the image from current selection.
    function SelectAndInsertTheImage() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    var v = trim(result.value);
                    SendAndParseTheRequest(v);
                } else {
                    return "false";
                }
            }
        );
        
    }


    //Insert the image from custom input.
    function SearchAndInsertTheImage() {
        var imageName = document.getElementById('searchBox').value;
        SendAndParseTheRequest(imageName);
    }


    //Send the http request using the GET-method.
    function SendAndParseTheRequest(imageName) {
        if (imageName == "")
            return false;
        var options = {
            url: "https://www.bingapis.com/api/v4/images/search",
            data: "appid=CDDD89A468E3781699EA1FA5D91447231D6E386E&mkt=en-us&" + "q=" + imageName + "&form=monitr&traffictype=Internal_monitor&count=1",
            method: "GET",
            async: true,
            successCall: function (responseData) {
                if (!responseData)
                    return false;
                if (responseData.answers[0].images.length > 0) {
                    var imageUrl = responseData.answers[0].images[0].contentUrl;
                    writeHtmlData(imageUrl);
                }
            }
        };

        AsynchrousHttpRequest(options);
    }

    //end edit here.
})();