const { connection } = require("./connection.js");
const { Notification } = require("electron");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

const buscarCliente = async (cedula) => {
  const sql = `SELECT 
    id AS cliente_id,
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
        cedula_cliente = ?`;
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

  async function buscarCliente(cedula) {
    try {
      const rows = await ejecutarConsulta(sql, [cedula]);
      showNotificacion("Busqueda completada ✔️", "SUCCES");
      return rows;
    } catch (error) {
      console.error("Error al buscar la tabla cliente:", error);
      showNotificacion("Error al buscar el cliente ❌", "ERROR");
    }
  }

  async function buscarTablaCliente(cedula) {
    try {
      const rows = await ejecutarConsulta(sqlTable, [cedula]); 
      showNotificacion("Búsqueda completada ✔️", "SUCCESS TABLE CLIENT");
      return rows;
    } catch (error) {
      console.error("Error al buscar la tabla cliente:", error);
      showNotificacion("Error al buscar la tabla cliente ❌", "ERROR");
    }
  }

  const dataTable = await buscarTablaCliente(cedula);
  const dataClient = await buscarCliente(cedula);
  return { dataClient, dataTable };
};
module.exports = {
  buscarCliente,
};
