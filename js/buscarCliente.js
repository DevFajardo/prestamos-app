const { connection } = require("./connection.js");
const { Notification } = require("electron");

//funcion para mostrar una notificacion pasandole le titulo y cuerpo
const showNotificacion = (title, body) => {
  new Notification({ title, body }).show();
};

//funcion para buscar al cliente por medio de la cedula o la lirbanza escojida si el cliente tiene dos o mas prestamos a su nombre
const buscarCliente = async (cedula, libranzaEscojida) => {
  let libranza;
  //consulta para buscar la informacion del cliente
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

  // consulta para buscar la informacion de la tabla de prestamo del cliente
  const sqlTable = `SELECT 
        id AS tabla_clientes_id,
        periodo,
        saldo_anterior,
        abono_interes,
        abono_capital,
        nuevo_saldo,
        estado,
        codigo_libranza
      FROM 
        tabla_clientes
      WHERE 
        codigo_libranza = ?`;

  //funcion para ejecutar la consulta sql y manejar los errores
  function ejecutarConsulta(sql, parametros) {
    return new Promise((resolve, reject) => {
      //ejecuta la peticion
      connection.execute(sql, parametros, (err, rows) => {
        if (err) {
          reject(err); // Rechaza la promesa con el error
        } else {
          resolve(rows); // Resuelve la promesa con los datos
        }
      });
    });
  }

  //funcion para buscar los datos del cliente por medio de la cedula
  async function buscardatoCliente(cedula) {
    try {
      //ejecutamos la consulta
      const rows = await ejecutarConsulta(sql, [cedula]);
      showNotificacion("Busqueda completada ✔️", "SUCCES");
      //se guarda el codigo de libraza para pasarlo para buscar la tabla de este cliente
      libranza = rows.map((obj) => obj.codigo_libranza)[0];
      return rows;
    } catch (error) {
      console.error("Error al buscar los datos del cliente:", error);
      showNotificacion("Error al buscar el cliente ❌", "ERROR");
    }
  }

  //funcion para buscar la tabla de prestamos del cliente buscado por medio de la libranza guardada en la funcion anterior
  async function buscarTablaCliente(libranza) {
    try {
      const rows = await ejecutarConsulta(sqlTable, [libranza]);
      showNotificacion("Búsqueda completada ✔️", "SUCCESS TABLE CLIENT");
      return rows;
    } catch (error) {
      console.error("Error al buscar la tabla cliente:", error);
      showNotificacion("Error al buscar la tabla cliente ❌", "ERROR");
    }
  }

  //buscamos al cliente
  const dataClient = await buscardatoCliente(cedula);
  //validamos si el cliente buscado tiene mas de un prestamo a su nombre
  if (dataClient.length > 1) {
    //buscamos los datos de la tabla de prestamos con la libranza escojida por el usuario
    const dataTable = await buscarTablaCliente(libranzaEscojida);
    return { dataClient, dataTable };
  }
  //si el usuario solo tiene un prestamo a su nombre se buscara su tabla
  const dataTable = await buscarTablaCliente(libranza);

  return { dataClient, dataTable };
};
module.exports = {
  buscarCliente,
};
