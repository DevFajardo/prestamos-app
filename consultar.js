const btnCedula = document.getElementById("btnCedula");
const inputCedula = document.getElementById("cedula");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const tbody = document.querySelector("#tablaAmortizacion tbody");
const modal = document.getElementById("myModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const usersContent = document.getElementById("users-content");

btnCedula.addEventListener("click", async () => {
  const accion = {
    confirmar: 1,
    revertir: 2,
  };
  const cedula = inputCedula.value;
  const { dataClient, dataTable } = await window.excelAPI.searchCedula(cedula);
  if (dataClient.length > 1) {
    modal.style.display = "block";
    dataClient.forEach((cliente) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${cliente.nombre}</h3>
        <p><strong>Libranza:</strong> ${cliente.codigo_libranza}</p>
      `;
      card.onclick = () => {
        alert(`Has seleccionado al cliente: ${cliente.nombre} libranza ${cliente.codigo_libranza}`);
      };
      usersContent.appendChild(card);
    });
  } else {
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
      <td><input class="inputs" value="✔️" id="${dato.periodo}" type=button></td>
      `;
      } else {
        fila.innerHTML = `
        <td>${dato.periodo}</td>
        <td>${dato.saldo_anterior}</td>
        <td class="negative">${dato.abono_interes}</td>
        <td class="negative">${dato.abono_capital}</td>
        <td>${dato.nuevo_saldo}</td>
        <td><input class="inputs" value="❌"  id="${dato.periodo}" type=button ></td>
         `;
        fila.style.backgroundColor = "green";
      }
      tbody.appendChild(fila);
    });
  }

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
    usersContent.innerHTML = "";
  };

  const buttons = document.querySelectorAll(".inputs");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (button.value == "❌") {
        const filaPresionada = document.getElementById(
          "fila" + event.target.id
        );
        filaPresionada.style.backgroundColor = "white";
        button.value = "✔️";
        window.excelAPI.cambiarEstado(
          event.target.id,
          dataClient[0].codigo_libranza,
          accion.revertir
        );
      } else {
        const filaPresionada = document.getElementById(
          "fila" + event.target.id
        );
        filaPresionada.style.backgroundColor = "green";
        button.value = "❌";
        window.excelAPI.cambiarEstado(
          event.target.id,
          dataClient[0].codigo_libranza,
          accion.confirmar
        );
      }
    });
  });
});

registrar.addEventListener("click", () => {
  window.excelAPI.registrar("index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.consultar("consultar.html");
});
