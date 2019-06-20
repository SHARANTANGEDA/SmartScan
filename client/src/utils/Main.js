///////////////////////////////////////////////////////////////
const {app, BrowserWindow} = require('electron')
const path = require('path')
server = require("../../../server")
const createWindow = () => {

  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
// and load the index.html of the app.
//  win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  win.loadURL(`http://localhost:3000/`)
}
app.on('ready', createWindow)
//////////////////////////////////////////////////////////////