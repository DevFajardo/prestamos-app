const btnCedula = document.getElementById("btnCedula");
const inputCedula = document.getElementById("cedula");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const tbody = document.querySelector("#tablaAmortizacion tbody");

btnCedula.addEventListener("click", async () => {
  const cedula = inputCedula.value;
  const { dataClient, dataTable } = await window.excelAPI.searchCedula(cedula);

 dataTable.forEach((dato) => {
  const fila = document.createElement("tr");

  fila.innerHTML = `
      <td>${dato.periodo}</td>
      <td>${dato.saldo_anterior}</td>
      <td class="negative">${dato.abono_interes}</td>
      <td class="negative">${dato.abono_capital}</td>
      <td>${dato.nuevo_saldo}</td>
      <td>${dato.estado}</td>
  `;

  tbody.appendChild(fila);
}); 
});

registrar.addEventListener("click", () => {
  window.excelAPI.registrar("index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.consultar("consultar.html");
});

 
