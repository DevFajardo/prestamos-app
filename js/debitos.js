const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const debitos = document.getElementById("debitos");

registrar.addEventListener("click", () => {
  window.excelAPI.cambiarRuta("./html/index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.cambiarRuta("./html/consultar.html");
});

debitos.addEventListener("click", () => {
  window.excelAPI.cambiarRuta("./html/debitos.html");
});
