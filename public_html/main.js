var express = require('express');
const {app, BrowserWindow} = require('electron')
var path = require('path');
var url = require('url');

var server = express();

server.use('/', express.static(__dirname + '/'));

server.get('/callback.html', function (req, res) {
    var index = fs.readFileSync(__dirname + '/callback.html');
    res.write(index);
    res.end();
});

server.get('/*', function (req, res) {

    var index = fs.readFileSync(__dirname + '/index.html', 'utf8');

      
});

server.get('/', function (req, res) {
     var index = fs.readFileSync(__dirname + '/index.html', 'utf8');

   
    res.write(index);
    res.end();
   
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win



// Force Single Instance Application
const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.

  // Protocol handler for win32
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv.slice(1)
  }
  logEverywhere("app.makeSingleInstance# " + deeplinkingUrl)

  if (win) {
    if (win.isMinimized()) win.restore()
        win.focus()
  }
})
if (shouldQuit) {
    app.quit()
    return
}

function createWindow () {

  	server.listen(2858)
    // Create the browser window.
    win = new BrowserWindow({
        width: 1920, 
        height: 1080,
        webPreferences: {
            nodeIntegration: false
        },
        titleBarStyle: 'hiddenInset'
    })
  
    // and load the index.html of the app.
    win.loadURL('http://127.0.0.1:2858')
  
    // Open the DevTools.
    win.webContents.openDevTools()
    
    // Protocol handler for win32
    if (process.platform == 'win32') {
      // Keep only command line / deep linked arguments
      deeplinkingUrl = process.argv.slice(1)
    }
    
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
}
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
    
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient('spotify')

  // Protocol handler for osx
  app.on('open-url', function (event, url) {
    event.preventDefault()
    deeplinkingUrl = url
    if (win && win.webContents) {
      win.webContents.executeJavaScript(`document.querySelector("sp-viewstack").navigate("${url}")`)
    }
    // logEverywhere("open-url# " + deeplinkingUrl)

  })

  // Log both at dev console and at running node console instance
  function logEverywhere(s) {
    throw s
      if (win && win.webContents) {
          win.webContents.executeJavaScript(`alert("${s}")`)
      }
  }
