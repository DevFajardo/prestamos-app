const btnCedula = document.getElementById("btnCedula");
const inputCedula = document.getElementById("cedula");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const tbody = document.querySelector("#tablaAmortizacion tbody");

btnCedula.addEventListener("click", async () => {
  const cedula = inputCedula.value;
  const { dataClient, dataTable } = await window.excelAPI.searchCedula(cedula);

  await dataTable.forEach((dato) => {
    const fila = document.createElement("tr");
    fila.id = "fila" + dato.periodo;

    if (dato.estado == 0) {
      fila.innerHTML = `
    <td>${dato.periodo}</td>
    <td>${dato.saldo_anterior}</td>
    <td class="negative">${dato.abono_interes}</td>
    <td class="negative">${dato.abono_capital}</td>
    <td>${dato.nuevo_saldo}</td>
    <td><input class="inputEstado" value="✔️" id="${dato.periodo}" type=button></td>
    `;
    } else {
      fila.innerHTML = `
      <td>${dato.periodo}</td>
      <td>${dato.saldo_anterior}</td>
      <td class="negative">${dato.abono_interes}</td>
      <td class="negative">${dato.abono_capital}</td>
      <td>${dato.nuevo_saldo}</td>
      <td><input class="inputEstado" value="✔️" id="${dato.periodo}" type=button disabled></td>
       `;
      fila.style.backgroundColor = "green";
    }
    tbody.appendChild(fila);
  });
  const buttons = document.querySelectorAll(".inputEstado");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log(`Se marcó el checkbox con valor: ${event.target.id}`);
      const filaPresionada = document.getElementById("fila" + event.target.id);
      filaPresionada.style.backgroundColor = "green";
      button.disabled = true;
      window.excelAPI.cambiarEstado(event.target.id, cedula);
    });
  });
});

registrar.addEventListener("click", () => {
  window.excelAPI.registrar("index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.consultar("consultar.html");
});
