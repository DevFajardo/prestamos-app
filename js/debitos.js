const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const debitos = document.getElementById("debitos");
const btn = document.getElementById("file");

btn.addEventListener("click", async () => {
  await window.excelAPI.rellenarPlantilla();
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
