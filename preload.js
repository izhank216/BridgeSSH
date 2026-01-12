const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ssh', {
  connect: (opts) => ipcRenderer.invoke('ssh-connect', opts),
  sendInput: (data) => ipcRenderer.send('ssh-input', data),
  onOutput: (callback) => ipcRenderer.on('ssh-output', (_, data) => callback(data)),
  onStatus: (callback) => ipcRenderer.on('ssh-status', (_, status) => callback(status))
})
