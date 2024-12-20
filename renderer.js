const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  const filePath = await window.excelAPI.openFile()
})