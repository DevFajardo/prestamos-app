const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("excelAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  searchCedula: (cedula) => ipcRenderer.invoke("searchCedula", cedula),
  registrar: (file) => ipcRenderer.send("registrar", file),
  consultar: (file) => ipcRenderer.send("consultar", file),
  cambiarEstado: (periodo, cedula) =>
    ipcRenderer.send("estado", periodo, cedula),
});
