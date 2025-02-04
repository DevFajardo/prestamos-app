const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const ExcelJS = require("exceljs");
/* const { setMainMenu } = require("./js/menu.js"); */
const { guardarCliente } = require("./js/guardarCliente.js");
const { buscarCliente } = require("./js/buscarCliente.js");
const { cambiarEstado } = require("./js/cambiarEstado.js");

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

async function handleRellenarPlantilla() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  let busco = 0;
  if (!canceled) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePaths[0]);
    const firstSheet = workbook.worksheets[0];
    firstSheet.eachRow(async (row, rowNumber) => {
      if (rowNumber == 1) return;
      if (row.values[1] == null) return;
      const clientExcel = {
        row: rowNumber,
        cedula: row.values[1],
        libranza: row.values[3],
        cuota: row.values[11],
      };
      try {
        const { dataClient, dataTable } = await buscarCliente(
          clientExcel.cedula,
          clientExcel.libranza
        );
        let fallo = 0;
        if (dataClient.length == 0) {
          const cellLN = firstSheet.getCell("L" + clientExcel.row); //celda de interes
          const cellMN = firstSheet.getCell("M" + clientExcel.row); //celda de capital
          cellLN.value = "?";
          cellMN.value = "?";
          cellLN.font = {
            color: { argb: "FF0000" }, // Rojo
            bold: true, // Opcional: poner en negrita
          };
          cellMN.font = {
            color: { argb: "FF0000" }, // Rojo
            bold: true, // Opcional: poner en negrita
          };
          console.log("no se encontro el cliente");
          await workbook.xlsx.writeFile("archivo.xlsx");
        }
        for (let i = 0; i < dataClient.length; i++) {
          const client = dataClient[i];
          if (clientExcel.libranza == client.codigo_libranza) {
            fallo = 0;
            const cellLSi = firstSheet.getCell("L" + clientExcel.row); //celda de interes
            const cellMSi = firstSheet.getCell("M" + clientExcel.row); //celda de capital

            for (let i = 0; i <= parseInt(dataClient[0].no_cuotas); i++) {
              if (dataTable[i].estado == 0) {
                cellLSi.value =
                  cellLSi.value +
                  Math.abs(Math.floor(parseFloat(dataTable[i].abono_interes)));
                cellMSi.value =
                  cellMSi.value +
                  Math.abs(parseInt(dataTable[i].abono_capital));
                console.log(
                  "cliente : ",
                  dataClient[0].nombre,
                  "celda i",
                  cellLSi.value,
                  "celda c",
                  cellMSi.value,
                  "cuota",
                  clientExcel.cuota
                );
                if (cellLSi.value + cellMSi.value == clientExcel.cuota) {
                  console.log("si fue igual", cellLSi.value + cellMSi.value);
                  busco = 0;
                  await workbook.xlsx.writeFile("archivo.xlsx");
                  break;
                } else {
                  busco++;

                  if (busco == 2) {
                    busco = 0;
                    console.log(
                      "busco dos veces",
                      dataClient[0].nombre,
                      cellLSi.value,
                      cellMSi.value
                    );
                    cellLSi.font = {
                      color: { argb: "FF0000" }, // Rojo
                      bold: true, // Opcional: poner en negrita
                    };
                    cellMSi.font = {
                      color: { argb: "FF0000" }, // Rojo
                      bold: true, // Opcional: poner en negrita
                    };
                    await workbook.xlsx.writeFile("archivo.xlsx");
                    break;
                  }
                }
              }
            }
          } else {
            fallo++;
            if (fallo == dataClient.length) {
              const cellLF = firstSheet.getCell("L" + clientExcel.row); //celda de interes
              const cellMF = firstSheet.getCell("M" + clientExcel.row); //celda de capital
              cellLF.value = "L";
              cellMF.value = "L";
              cellLF.font = {
                color: { argb: "FF0000" }, // Rojo
                bold: true, // Opcional: poner en negrita
              };
              cellMF.font = {
                color: { argb: "FF0000" }, // Rojo
                bold: true, // Opcional: poner en negrita
              };
              console.log("la libranza no es correcta");
              await workbook.xlsx.writeFile("archivo.xlsx");
            }
          }
        }
      } catch (error) {
        console.log("error: ", error);
      }
      await workbook.xlsx.writeFile("archivo.xlsx");
    });
  }
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
  ipcMain.handle("dialog:rellenarPlantilla", async () => {
    const fillData = await handleRellenarPlantilla();
  });
  ipcMain.handle("searchCedula", handleSearchClient);
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
