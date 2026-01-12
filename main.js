const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const net = require('net')
const { SSH2Stream } = require('ssh2-streams')

let mainWindow
let sshClient

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
}

app.whenReady().then(createWindow)

ipcMain.handle('ssh-connect', async (event, { host, port, username, password, protocol }) => {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port || 22, host, () => {
      sshClient = new SSH2Stream({ protocol: protocol || '2' })
      sshClient.on('ready', () => {
        mainWindow.webContents.send('ssh-status', 'BridgeSSH Connected!')
        resolve('Connected')
      })
      sshClient.on('error', (err) => {
        mainWindow.webContents.send('ssh-status', 'BridgeSSH Error: ' + err.message)
        reject(err)
      })
      socket.pipe(sshClient).pipe(socket)
      if (password) sshClient.authPassword(username, password)
      else sshClient.authPassword(username, '')
    })
    socket.on('error', (err) => reject(err))
  })
})

ipcMain.on('ssh-input', (event, data) => {
  if (!sshClient) return
  sshClient.write(data)
})
