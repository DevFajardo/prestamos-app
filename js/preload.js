const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("excelAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  searchCedula: (cedula, libranzaEscojida) => ipcRenderer.invoke("searchCedula", cedula, libranzaEscojida),
  registrar: (file) => ipcRenderer.send("registrar", file),
  consultar: (file) => ipcRenderer.send("consultar", file),
  cambiarEstado: (periodo, libranza, accion) =>
    ipcRenderer.send("estado", periodo, libranza, accion),
});
