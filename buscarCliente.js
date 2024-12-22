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

  connection.execute(sql, [cedula], (err, rows, fields) => {
    if (err instanceof Error) {
      console.log(err);
      showNotificacion("Error al buscar el cliente ❌", "ERROR");
      return;
    }
    console.log("salio succes buscar cliente");
    showNotificacion("Busqueda completada ✔️", "SUCCES");
    console.log(rows);
  });

  connection.execute(sqlTable, [cedula], (err, rows, fields) => {
    if (err instanceof Error) {
      console.log(err);
      showNotificacion("Error al buscar la tabla cliente ❌", "ERROR");
      return;
    }
    console.log("salio succes buscar tabla cliente");
    showNotificacion("Busqueda completada ✔️", "SUCCES TABLE CLIENT");
    console.log(rows);
  });
};

module.exports = {
  buscarCliente,
};
