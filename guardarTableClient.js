const { connection } = require("./connection.js");
const { Notification } = require("electron");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

const guardarTableClient = (valueTable, nombre) => {
  const sql = `
      INSERT INTO tabla_clientes (periodo, saldo_anterior, abono_interes, abono_capital, nuevo_saldo, cedula_cliente)
      VALUES ${valueTable.join(", ")}
    `;

  connection.query(sql, function (err, result) {
    if (err instanceof Error) {
      console.log("entro al error");
      console.log(err);
      showNotificacion(
        "error",
        "Error al registrar la tabla prestamo del cliente ❌"
      );
      return;
    }
    console.log("salio succes guardar tabla prestamo del cliente");
    showNotificacion(
      "succes",
      "Cliente " + nombre + " registrado correctamente ✔️"
    );
  });
};

module.exports = {
  guardarTableClient,
};
