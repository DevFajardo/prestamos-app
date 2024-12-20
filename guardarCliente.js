const { connection } = require("./connection.js");
const { Notification } = require("electron");

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
  abono_capital
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
      showNotificacion("error", "Error al registrar el cliente ❌");
      return;
    }
    console.log("salio succes");
    showNotificacion(
      "succes",
      "Cliente " + nombre + " registrado correctamente ✔️"
    );
  });
};

module.exports = {
  guardarCliente,
};
