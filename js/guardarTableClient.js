const { connection } = require("./connection.js");
const { Notification } = require("electron");

const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

const guardarTableClient = (valueTable, nombre, libranza) => {
  const sql = `
      INSERT INTO tabla_clientes (periodo, saldo_anterior, abono_interes, abono_capital, nuevo_saldo, codigo_libranza)
      VALUES ${valueTable.join(", ")}
    `;

  connection.query(sql, function (err, result) {
    if (err instanceof Error) {
      console.log("entro al error");
      console.log(err);
      const sqlDel = `DELETE FROM clientes WHERE codigo_libranza = ${libranza};
      `;
      connection.query(sqlDel, function (err, result) {
        if (err instanceof Error) {
          console.log(
            "error de borrar el cliente cuando hubo un error al registrar la tabla de prestamo"
          );
        }
      });
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
