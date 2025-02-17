const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const ExcelJS = require("exceljs");
/* const { setMainMenu } = require("./js/menu.js"); */
const { guardarCliente } = require("./js/guardarCliente.js");
const { buscarCliente } = require("./js/buscarCliente.js");
const { cambiarEstado } = require("./js/cambiarEstado.js");
const accion = {
  confirmar: 1,
  revertir: 2,
};
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

    // Recorremos las filas manualmente
    for (const [rowIndex, row] of firstSheet
      .getRows(2, firstSheet.rowCount - 1)
      .entries()) {
      if (!row || row.values[1] == null) continue; // Ignorar filas vacías

      const clientExcel = {
        row: rowIndex + 2, // Ajusta el número de fila
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
          const cellLN = firstSheet.getCell("L" + clientExcel.row);
          const cellMN = firstSheet.getCell("M" + clientExcel.row);
          cellLN.value = "?";
          cellMN.value = "?";
          cellLN.font = { color: { argb: "FF0000" }, bold: true };
          cellMN.font = { color: { argb: "FF0000" }, bold: true };
          console.log("No se encontró el cliente");
          await workbook.xlsx.writeFile("archivo.xlsx");
          continue;
        }

        for (let i = 0; i < dataClient.length; i++) {
          const client = dataClient[i];
          if (clientExcel.libranza === client.codigo_libranza) {
            fallo = 0;
            const cellLSi = firstSheet.getCell("L" + clientExcel.row);
            const cellMSi = firstSheet.getCell("M" + clientExcel.row);

            for (let j = 0; j <= parseInt(dataClient[0].no_cuotas); j++) {
              if (dataTable[j].estado == 0) {
                cellLSi.value =
                  cellLSi.value +
                  Math.abs(Math.floor(parseFloat(dataTable[j].abono_interes)));
                cellMSi.value =
                  cellMSi.value +
                  Math.abs(parseInt(dataTable[j].abono_capital));

                console.log(
                  "Cliente:",
                  dataClient[0].nombre,
                  "celda i:",
                  cellLSi.value,
                  "celda c:",
                  cellMSi.value
                );

                if (cellLSi.value + cellMSi.value === clientExcel.cuota) {
                  console.log("Sí fue igual:", cellLSi.value + cellMSi.value);
                  busco = 0;
                  await cambiarEstado(
                    dataTable[j].periodo,
                    clientExcel.libranza,
                    1
                  );
                  await workbook.xlsx.writeFile("archivo.xlsx");
                  break;
                } else {
                  busco++;
                  if (busco == 2) {
                    busco = 0;
                    console.log(
                      "Busco dos veces",
                      dataClient[0].nombre,
                      cellLSi.value,
                      cellMSi.value
                    );
                    cellLSi.font = { color: { argb: "FF0000" }, bold: true };
                    cellMSi.font = { color: { argb: "FF0000" }, bold: true };
                    await workbook.xlsx.writeFile("archivo.xlsx");
                    break;
                  }
                }
              }
            }
          } else {
            fallo++;
            if (fallo == dataClient.length) {
              const cellLF = firstSheet.getCell("L" + clientExcel.row);
              const cellMF = firstSheet.getCell("M" + clientExcel.row);
              cellLF.value = "L";
              cellMF.value = "L";
              cellLF.font = { color: { argb: "FF0000" }, bold: true };
              cellMF.font = { color: { argb: "FF0000" }, bold: true };
              console.log("La libranza no es correcta");
              await workbook.xlsx.writeFile("archivo.xlsx");
            }
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }

      await workbook.xlsx.writeFile("archivo.xlsx");
    }

    // Retornar 1 cuando finalice todo
    return 1;
  }

  // Retornar 0 si se canceló el diálogo
  return 0;
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
  mainWindow.webContents.openDevTools();
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
  mainWindow.webContents.openDevTools();
  /* setMainMenu(mainWindow); */
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("dialog:rellenarPlantilla", async () => {
    return await handleRellenarPlantilla();
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
