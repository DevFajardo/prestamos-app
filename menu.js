const { app, Menu } = require("electron");

const setMainMenu = () => {
  const template = [
    {
      id: "1",
      label: app.name,
    },
    {
      id: "2",
      label: "Registrar",
      submenu: [
        { label: "cargar excel" },
        { type: "separator" },
        { label: "cargar manual" },

        
      ],
    },
    { id: "3", label: "Consultar" },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = {
  setMainMenu,
};
