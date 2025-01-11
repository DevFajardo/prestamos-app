const btn = document.getElementById("file");
const filePathElement = document.getElementById("filePath");
const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");

btn.addEventListener("click", async () => {
  await window.excelAPI.openFile();
});

registrar.addEventListener("click", () => {
  window.excelAPI.registrar("./html/index.html");
});

consultar.addEventListener("click", () => {
  window.excelAPI.consultar("./html/consultar.html");
});
