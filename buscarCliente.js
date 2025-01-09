const { connection } = require("./connection.js");
const { Notification } = require("electron");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};


const buscarCliente = async (cedula, libranza) => {
  const sql = `SELECT 
    id AS cliente_id,
    codigo_libranza,
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
    abono_capital
  FROM 
    clientes
  WHERE 
    cedula = ?`;

  const sqlTable = `SELECT 
        id AS tabla_clientes_id,
        periodo,
        saldo_anterior,
        abono_interes,
        abono_capital,
        nuevo_saldo,
        estado
      FROM 
        tabla_clientes
      WHERE 
        codigo_libranza = ?`;
  function ejecutarConsulta(sql, parametros) {
    return new Promise((resolve, reject) => {
      connection.execute(sql, parametros, (err, rows) => {
        if (err) {
          reject(err); // Rechaza la promesa con el error
        } else {
          resolve(rows); // Resuelve la promesa con los datos
        }
      });
    });
  }

  async function buscardatoCliente(cedula) {
    try {
      const rows = await ejecutarConsulta(sql, [cedula]);
      showNotificacion("Busqueda completada ✔️", "SUCCES");
      libranza = rows.map((obj) => obj.codigo_libranza)[0];
      return rows;
    } catch (error) {
      console.error("Error al buscar la tabla cliente:", error);
      showNotificacion("Error al buscar el cliente ❌", "ERROR");
    }
  }

  async function buscarTablaCliente(libranza) {
    try {
      const rows = await ejecutarConsulta(sqlTable, [libranza]);
      const formatearNumeros = (array) => {
        return array.map((obj) => {
          const formateado = { ...obj };
          formateado.saldo_anterior = formateado.saldo_anterior.toLocaleString(
            "es-ES",
            { minimumFractionDigits: 2 }
          );
          formateado.abono_interes = formateado.abono_interes.toLocaleString(
            "es-ES",
            { minimumFractionDigits: 2 }
          );
          formateado.abono_capital = formateado.abono_capital.toLocaleString(
            "es-ES",
            { minimumFractionDigits: 2 }
          );
          formateado.nuevo_saldo = formateado.nuevo_saldo.toLocaleString(
            "es-ES",
            { minimumFractionDigits: 2 }
          );
          return formateado;
        });
      };
      const datosFormateados = formatearNumeros(rows);
      showNotificacion("Búsqueda completada ✔️", "SUCCESS TABLE CLIENT");
      return datosFormateados;
    } catch (error) {
      console.error("Error al buscar la tabla cliente:", error);
      showNotificacion("Error al buscar la tabla cliente ❌", "ERROR");
    }
  }

  const dataClient = await buscardatoCliente(cedula);
  const dataTable = await buscarTablaCliente(libranza);
  return { dataClient, dataTable };
};
module.exports = {
  buscarCliente,
};
