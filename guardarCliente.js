const { connection } = require("./connection.js");
const { Notification } = require("electron");
const { guardarTableClient } = require("./guardarTableClient.js");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

const guardarCliente = (
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
) => {
  const sql =
    "INSERT INTO `clientes` (nombre, cedula, fecha_desembolso, no_cuotas, valor_desembolsado,pago,tasa_usura_mes,total_libranza,liquidacion,cuota,plazo,abono_int,abono_capital) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
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
  ];

  connection.query(sql, values, function (err, result) {
    if (err instanceof Error) {
      console.log("entro al error");
      showNotificacion(
        "Error al registrar el cliente ❌",
        "El excel esta mal o el registro ya esta creado"
      );
      return;
    }
    console.log("salio succes guardar cliente");
    guardarTableClient(valueTable, nombre, cedula);
  });
};

module.exports = {
  guardarCliente,
};
