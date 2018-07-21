$(document).ready(function () {
    $('#queryForm').on('submit', function (e) {
        e.preventDefault();
        var url = $(this).find('input').val(),
            width = 600 - 100,
            height = 480 - 100;

        // TODO: check if input field in empty

        $('body').css('margin', '0px').html('<webview style="width:' + width + 'px; height:' + height + 'px"></webview>');
        setWebView(url)
    })

    $(window).resize(function () {
        $('webview').css({'width': window.innerWidth, "height": window.innerHeight})
    })
})

function setWebView(url) {
    var url = parseUrl(url);

    if( url ) {
        document.querySelector('webview').src = url;
    }

}

function parseUrl(url) {
    var videoId = parseId(url),
        listId = getUrlVars(url, 'list'),
        embedUrl = '';

    if (videoId) {
        embedUrl = 'http://www.youtube.com/embed/' + videoId + '?';

        if (typeof listId !== 'undefined') {
            embedUrl += 'list=' + listId;
        } else {
            embedUrl += 'autoplay=1';

            if (typeof time !== 'undefined' && time !== false) {
                embedUrl += '&start=' + time;
            }
        }

        return embedUrl;
    } else {
        return false;
    }
}

function getUrlVars(url, variable) {
    var vars = {},
        hash,
        hashes = url.slice(url.indexOf('?') + 1).split('&');

    for (var i = 0, len = hashes.length; i < len; i += 1) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars[variable];
}

function getURLParameter(name, givenstring) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(givenstring) || [, null])[1]
    );
}

// parse video id from url
function parseId(url) {
    // http://stackoverflow.com/a/14701040
    var match = /^.*(youtube.com\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/.exec(url);

    if (match instanceof Array && match[2] !== undefined) {
        return match[2];
    } else {
        return false;
    }
}