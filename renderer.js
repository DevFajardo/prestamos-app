const btn = document.getElementById("btn");
const filePathElement = document.getElementById("filePath");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");

btn.addEventListener("click", async () => {
  const filePath = await window.excelAPI.openFile();
});

registrar.addEventListener("click", () => {
  window.excelAPI.registrar("index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.consultar("consultar.html");
});
