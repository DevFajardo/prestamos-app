const registrar = document.getElementById("registrar");
const consultar = document.getElementById("consultar");
const debitos = document.getElementById("debitos");
const btn = document.getElementById("file");
const cargando = document.getElementById("cargando");
const fileContainer = document.querySelector(".file-container");

btn.addEventListener("click", async () => {
  cargando.style.display = "flex";
  fileContainer.style.display = "none";
  const result = await window.excelAPI.rellenarPlantilla();

  if (result == 0) {
    console.log(result);
    cargando.style.display = "none";
    fileContainer.style.display = "flex";
    return;
  }

  if (result == 1) {
    console.log(result)
    cargando.style.display = "none";
    fileContainer.style.display = "flex";
    return;
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
