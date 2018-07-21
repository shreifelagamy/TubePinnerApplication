function createWindow(url, type = 'youtube') {
  var left = (screen.width - 480);
  var top = (screen.height - 320);
  chrome.app.window.create('popup.html', {
    'outerBounds': {
      'width': 600,
      'height': 480,
      'left': left,
      'top': top
    },
    minWidth: 335,
    resizable: true,
    minHeight: 223,
    alwaysOnTop: true
  }, function (appwindow) {

    appwindow.contentWindow.onload = function () {
      if (url !== '')
        setFormVideoValues(appwindow, url, type);
    };

  });
  
}

// parse parameter from url
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

// load webview
function webview(url, time) {

  url = url.replace(/^\s+|\s+$/g, ''); // remove newlines

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

function setFormVideoValues(appwindow, url, type) {
  var body = appwindow.contentWindow.document.getElementsByTagName('body')[0]
    // width = 600-100,
    width = 600,
    height = 480-20;

  body.innerHTML = '<webview style="width:' + width + 'px; height:' + height + 'px"></webview>';
  body.querySelector('webview').src = !_.includes(url, 'http') && !_.includes(url, 'https') ? 'https:'+url : url;
  body.style.margin = 0
}

chrome.app.runtime.onLaunched.addListener(function () {
  createWindow('')
});

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if (request.action == 'showVideo')
    createWindow(request.url)

  sendResponse({
    success: true
  })
})