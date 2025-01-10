const { app, Menu} = require("electron");

const setMainMenu = (mainWindow) => {
  const template = [
    {
      id: "1",
      label: app.name,
    },
    {
      id: "2",
      label: "Registrar",
      submenu: [
        {
          label: "Cargar Excel",
          click: async () => mainWindow.loadFile("index.html"),
        },
        { label: "Cargar Manual" },
        {
          label: "View",
          submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" },
          ],
        },
      ],
    },
    {
      id: "3",
      label: "Consultarxd",
      click: async () => mainWindow.loadFile("consultar.html"),
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = {
  setMainMenu,
};
