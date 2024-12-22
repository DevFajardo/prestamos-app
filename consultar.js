const btnCedula = document.getElementById("btnCedula");
const inputCedula = document.getElementById("cedula");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");

btnCedula.addEventListener("click", () => {
  const cedula = inputCedula.value;
  console.log(cedula);
  window.excelAPI.searchCedula(cedula);
});

registrar.addEventListener("click", () => {
  window.excelAPI.registrar("index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.consultar("consultar.html");
});
