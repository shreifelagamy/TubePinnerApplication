var webview;
var extId = 'gdomlckgcnapccdieneppampndclkdels';

$(document).ready(function () {
    removeLoading()
    checkExtenstionExist()
    
    $('#queryForm').on('submit', function (e) {
        e.preventDefault();

        var url = $(this).find('input').val();

        // TODO: check if input field in empty
        $('body .container-div').html('<webview style="width:100%; height:100%"></webview>');
        webview = document.querySelector('webview')

        $('.overlay').removeClass('hide')
        fixContainerstyle()
        setWebView(url)
        beginWebviewListeners()
    })
})

window.addEventListener('resize', function () {
    $('body').css({
        'width': window.innerWidth,
        "height": window.innerHeight
    })
})

window.addEventListener('load', function () {
    webview = document.querySelector('webview')
    if (webview !== null) {
        // check if webview is not null
        beginWebviewListeners()
        fixContainerstyle()
    }
})

// remove loading div
function removeLoading() {
    var body = document.querySelector('body'),
        loadingDiv = document.querySelector('.overlay'),
        form = document.querySelector('#queryForm'),
        webview = document.querySelector('webview')
    
    if( form !== null || webview !== null) 
        loadingDiv.classList.add('hide')
}

// Fix body container style
function fixContainerstyle() {
    if (webview !== null) {
        $('body').css({
            'margin': 0,
            'width': window.innerWidth,
            'height': window.innerHeight
        })
        $('body .container-div').css({
            'width': '100%',
            'height': '100%',
            'margin': 0,
            'padding': 0
        });
    }
}

// handle loading new content in webview
function beginWebviewListeners() {
    if (webview !== null) {
        webview.addEventListener('newwindow', newWindowRequest)
        webview.addEventListener('permissionrequest', webviewPermissionRequest);
        webview.addEventListener('loadstop', webviewLoadStop);
    }
}

function webviewLoadStop(e) {
    removeLoading()
}

function newWindowRequest(e) {
    e.preventDefault();
    setWebView(e.targetUrl)
}

function webviewPermissionRequest(e) {
    if (e.permission === 'fullscreen') {
        e.request.allow();
    }
}

function setWebView(url) {
    var url = parseUrl(url)
    if (url)
        webview.src = url;
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

// check if extentsion exist
function checkExtenstionExist() {
    chrome.runtime.sendMessage(extId, { action: 'doYouExist' }, function (response) {
        if( !response )
            $('#ext-dwn').removeClass('hide')
    })
}