const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const ExcelJS = require("exceljs");
/* const { setMainMenu } = require("./js/menu.js"); */
const { guardarCliente } = require("./js/guardarCliente.js");
const { buscarCliente } = require("./js/buscarCliente.js");
const { cambiarEstado } = require("./js/cambiarEstado.js");

/* const crearExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('MySheet');
  worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 32 },
    { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
  ];
  worksheet.addRow({ id: 1, name: 'John Doe', DOB: new Date(1970, 1, 1) });
  worksheet.addRow({ id: 2, name: 'Jane Doe', DOB: new Date(1965, 1, 7) });
  await workbook.xlsx.writeFile('./sample2.xlsx');
}
crearExcel(); */
let mainWindow;

const readFile = async (excelFile) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFile);
  const firstSheet = workbook.worksheets[0];
  const secondSheet = workbook.worksheets[1];
  let clientData = {};
  let clientTableData = [];
  let clientTotals = {};
  if (firstSheet && secondSheet) {
    firstSheet.eachRow(async (row, rowNumber) => {
      clientData[row.values[1]] = row.values[2].result
        ? row.values[2].result
        : row.values[2];
      if (row.values[3]) {
        clientData["LIBRANZA"] = row.values[3];
      }
    });
    secondSheet.eachRow(async (row, rowNumber) => {
      if (rowNumber == 9) {
        clientTotals["fila"] = rowNumber;
        clientTotals["abono int"] = row.values[5].result
          ? row.values[5].result
          : row.values[5];
        clientTotals["abono capital"] = row.values[6].result
          ? row.values[6].result
          : row.values[6];
      }
      if (rowNumber >= 14 && rowNumber <= 73) {
        const json = {
          fila: rowNumber,
          periodo: row.values[2].result ? row.values[2].result : row.values[2],
          "saldo anterior": row.values[3].result
            ? row.values[3].result
            : row.values[3],
          "abono a intereses": row.values[4].result
            ? row.values[4].result
            : row.values[4],
          "abono a capital": row.values[5].result
            ? row.values[5].result
            : row.values[5],
          "nuevo saldo": row.values[6].result
            ? row.values[6].result
            : row.values[6],
          codigo_libranza: clientData.LIBRANZA,
        };
        clientTableData.push(json);
      }
    });
    return [clientData, clientTotals, clientTableData];
  } else {
    console.log("No se encontró ninguna hoja en el archivo.");
  }
};
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    const [clientData, clientTotals, clientTableData] = await readFile(
      filePaths[0]
    );
    const valueTable = clientTableData.map(
      ({
        periodo,
        "saldo anterior": saldo_anterior,
        "abono a intereses": abono_intereses,
        "abono a capital": abono_capital,
        "nuevo saldo": nuevo_saldo,
        codigo_libranza,
      }) =>
        `(${periodo}, ${parseFloat(saldo_anterior.toFixed(2))}, ${parseFloat(
          abono_intereses.toFixed(2)
        )}, ${parseFloat(abono_capital.toFixed(2))}, ${parseFloat(
          nuevo_saldo.toFixed(2)
        )}, ${codigo_libranza})`
    );
    const libranza = clientData.LIBRANZA;
    const nombre = clientData.CLIENTE;
    const cedula = clientData.CEDULA;
    const fecha_desembolso = clientData["FECHA DESEMBOLSO"];
    const no_cuotas = clientData["NO. CUOTAS"];
    const valor_desembolsado = clientData["VALOR DESEMBOLSADO"];
    const pago = clientData.PAGO;
    const tasa_usura_mes = clientData["TASA USURA MES"] * 100;
    const total_libranza = clientData["total libranza "];
    const liquidacion = clientData["liquidacion "];
    const cuota = clientData.cuota;
    const plazo = clientData.plazo;
    const abono_int = clientTotals["abono int"];
    const abono_capital = clientTotals["abono capital"];
    const response = guardarCliente(
      libranza,
      nombre,
      cedula,
      fecha_desembolso,
      no_cuotas,
      valor_desembolsado,
      pago,
      tasa_usura_mes,
      total_libranza,
      liquidacion,
      cuota,
      plazo,
      abono_int,
      abono_capital,
      valueTable
    );
  }
  return "no seleccionaste ningun archivo";
}
async function handleSearchClient(e, cedula, libranzaEscojida) {
  const { dataClient, dataTable } = await buscarCliente(
    cedula,
    libranzaEscojida
  );
  return { dataClient, dataTable };
}
async function handleCambiarEstado(e, periodo, libranza, accion) {
  cambiarEstado(periodo, libranza, accion);
}
const handleCambiarRuta = (file) => {
  mainWindow.loadFile(file);
};

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    ...(process.platform !== "darwin"
      ? {
          titleBarOverlay: {
            color: "rgba(255, 255, 255, 1)",
            symbolColor: "black",
            height: 59,
          },
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, "./js/preload.js"),
      nodeIntegration: true,
    },
  });
  ipcMain.on("cambiarRuta", (e, file) => {
    handleCambiarRuta(file);
  });
  ipcMain.on("estado", handleCambiarEstado);

  mainWindow.loadFile("./html/index.html");
  /* setMainMenu(mainWindow); */
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("searchCedula", handleSearchClient);
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
