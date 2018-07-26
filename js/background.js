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