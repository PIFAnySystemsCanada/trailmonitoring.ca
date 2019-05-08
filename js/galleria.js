jQuery(document).ready(function ($) {
    var urlParams = new URLSearchParams(window.location.search);
    var date_id = 1;
    if (urlParams.has('id'))
    {
        var id = urlParams.get('id');
        if ((id>0) && (id<10))
        {
            date_id = id;
            console.log("Loading data for " + date_id + " days in the past");
        }
    }
    var data = JSON.stringify({
        "day": date_id,
        "camera_id": 1,
        "api_key": "YxtoQ4Taz2yBIHuuF6IBNWKt5HdjtY8X3Dk8exI4"
      });
      
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            //console.log(this.responseText);
            var result = JSON.parse(this.responseText);
            if (result['success'] == 'true')
            {
                var images = result['data']['records'];
                // Replace the gallery-title and gallery-items
                var now = new Date();
                var galleryTitleDiv = document.getElementById("gallery-title");
                galleryTitleDiv.innerHTML = "<h1>Image Gallery</h1></h1><h2>" + now.toDateString() + "</h2>";
                var galleryItemsDiv = document.getElementById("gallery-items");
                galleryItemsDiv.innerHTML = "<ul>";
                images.forEach(imageitem => {
                    galleryItemsDiv.innerHTML = galleryItemsDiv.innerHTML + 
                    '<li class="one-portfolio-item">' +
                    '<a class="portfolio-thumb-link" href="' + imageitem['directory'] + "/" + imageitem['filename'] + '" rel="portfolio">' +
                    '<img src="/images/webcam/201905/04/webcam-20190504-192135.jpg" alt="" />' +
                    '</a></li>';
                });
                galleryItemsDiv.innerHTML = galleryItemsDiv.innerHTML + "</ul>";
            }
            else
            {
                var galleryTitleDiv = document.getElementById("gallery-title");
                galleryTitleDiv.innerHTML = "<h1>Image Gallery</h1></h1><h2>" + result['message'] + "</h2>";
                console.log("Unable to load photos");
                console.log(result['message']);
            }
            Galleria.loadTheme('js/galleria/themes/classic/galleria.classic.js'); // Move outside doc ready when splitting files
            $('.galleria-portfolio').galleria({
                width: 900,
                height: 450
            });
        }
    });

    xhr.open("POST", "/api/photos/list.php");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);    
});