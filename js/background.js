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
  var container = appwindow.contentWindow.document.querySelector('.container-div')
    body = appwindow.contentWindow.document.querySelector('body'),
    // width = 600-100,
    width = 600,
    height = 480;

  container.innerHTML = '<webview style="width:100%; height:100%"></webview>';
  var webview = container.querySelector('webview')
  webview.src = !_.includes(url, 'http') && !_.includes(url, 'https') ? 'https:' + url : url;

  body.classList.add('external')
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