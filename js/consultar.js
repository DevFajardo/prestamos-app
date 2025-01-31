const inputCedula = document.getElementById("cedula");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const debitos = document.getElementById("debitos");
const tbody = document.querySelector("#tablaAmortizacion tbody");
const modal = document.getElementById("myModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const usersContent = document.getElementById("users-content");
const userInfo = document.getElementById("infoUserContainer");

inputCedula.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const accion = {
      confirmar: 1,
      revertir: 2,
    };
    const cedula = inputCedula.value;
    const { dataClient, dataTable } = await window.excelAPI.searchCedula(
      cedula,
      -1
    );
    if (dataClient.length > 1) {
      modal.style.display = "block";
      dataClient.forEach((cliente) => {
        const card = document.createElement("div");
        card.id = cliente.codigo_libranza;
        card.className = "card";
        card.innerHTML = `
          <h3>${cliente.nombre}</h3>
          <p><strong>Libranza:</strong> ${cliente.codigo_libranza}</p>
        `;
        usersContent.appendChild(card);
        card.onclick = async () => {
          const { dataClient, dataTable } = await window.excelAPI.searchCedula(
            cedula,
            card.id
          );
          modal.style.display = "none";
          usersContent.innerHTML = "";
          userInfo.innerHTML = "";
          const parrafo = document.createElement("p");
          parrafo.innerHTML = ` ${cliente.nombre} - Libranza: ${cliente.codigo_libranza}`;
          parrafo.style.fontWeight = "bold";
          userInfo.appendChild(parrafo);
          tbody.innerHTML = "";
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
                  card.id,
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
                  card.id,
                  accion.confirmar
                );
              }
            });
          });
        };
      });
    } else {
      userInfo.innerHTML = "";
      const parrafo = document.createElement("p");
      parrafo.innerHTML = ` ${dataClient[0].nombre} - Libranza: ${dataClient[0].codigo_libranza}`;
      parrafo.style.fontWeight = "bold";
      userInfo.appendChild(parrafo);
      tbody.innerHTML = "";
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
    }

    closeModalBtn.onclick = function () {
      modal.style.display = "none";
      usersContent.innerHTML = "";
    };
  }
});

registrar.addEventListener("click", () => {
  window.excelAPI.cambiarRuta("./html/index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.cambiarRuta("./html/consultar.html");
});

debitos.addEventListener("click", () => {
  window.excelAPI.cambiarRuta("./html/debitos.html");
});
