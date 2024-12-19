const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('excelAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})