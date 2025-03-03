const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("excelAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  rellenarPlantilla: async () => {
    return await ipcRenderer.invoke("dialog:rellenarPlantilla");
  },
  searchCedula: (cedula, libranzaEscojida) =>
    ipcRenderer.invoke("searchCedula", cedula, libranzaEscojida),
  cambiarRuta: (file) => ipcRenderer.send("cambiarRuta", file),
  cambiarEstado: (periodo, libranza, accion) =>
    ipcRenderer.send("estado", periodo, libranza, accion),
});
