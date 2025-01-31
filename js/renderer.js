const btn = document.getElementById("file");
const filePathElement = document.getElementById("filePath");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const debitos = document.getElementById("debitos");

btn.addEventListener("click", async () => {
  await window.excelAPI.openFile();
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
