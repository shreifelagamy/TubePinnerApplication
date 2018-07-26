$(document).ready(function () {
    $('#queryForm').on('submit', function (e) {
        e.preventDefault();
        var url = $(this).find('input').val(),
            width = 600,
            height = 480 - 30;

        // TODO: check if input field in empty
        $('body').css('margin', 0)
        $('body .container').css({
            'width': '600px',
            'height': '480px',
            'margin': 0,
            'padding': 0
        }).html('<webview style="width:' + width + 'px; height:' + height + 'px"></webview>');

        setWebView(url)

        beginListeners()

        $('.overlay').removeClass('hide')
        $('webview').on('loadstop', function () {
            $('.overlay').addClass('hide')
        })
    })

    $(window).resize(function () {
        $('webview').css({
            'width': window.innerWidth,
            "height": window.innerHeight
        })
    })
}).ajaxSend(function (event, jqxhr, settings) {
    console.log(settings);
})

// handle loading new content in webview
function beginListeners() {
    var webview = document.querySelector('webview')
    webview.addEventListener('newwindow', function (e) {
        e.preventDefault();
        setWebView(e.targetUrl)
    })

    webview.addEventListener('permissionrequest', function (e) {
        if (e.permission === 'fullscreen') {
            e.request.allow();
        }
    });
}

function setWebView(url) {
    var url = parseUrl(url)
    if (url )
        document.querySelector('webview').src = url;
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
            embedUrl += 'autoplay=1&showinfo=1&rel=1&frameborder=0';

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