function convertirSaltosDeLinea(texto) {
  if (!texto) return "";
  return texto
    .split('\n')
    .map(linea => `<p>${linea.trim()}</p>`)
    .join('');
}

function descargarPDF() {
  const boton = document.querySelector('button[type="button"]');
  boton.style.display = 'none';

  reemplazarTextareasPorTexto();

  const resumen = document.querySelector('#contenidoPDF');
  const fechaTexto = document.getElementById('fechaContrato').value.trim() || '';

  const opciones = {
    margin: [16, 16, 18, 16],
    filename: 'Contrato_Leasing.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf()
    .set(opciones)
    .from(resumen)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        if (fechaTexto) {
          pdf.text(fechaTexto, pageWidth - 10, 10, { align: 'right' });
        }
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    })
    .save()
    .then(() => {
      boton.style.display = 'inline-block';
    });
}



function reemplazarTextareasPorTexto() {
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach((textarea) => {
    const div = document.createElement('div');
    div.innerHTML = convertirSaltosDeLinea(textarea.value);
    div.style.border = "none";
    div.style.whiteSpace = "pre-wrap";
    div.className = textarea.className;
    div.style.fontFamily = "inherit";
    textarea.parentNode.replaceChild(div, textarea);
  });

  // Aplica sangría a los <p> que empiezan en mayúscula
  // Selecciona todos los elementos de texto relevantes dentro de #contenidoPDF
document.querySelectorAll('#contenidoPDF p').forEach(p => {
  const texto = p.textContent.trim();
  if (texto && texto[0] === texto[0].toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(texto[0])) {
    p.classList.add('sangria');
  }
});
}

document.getElementById('inputFirmaArrendatario').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = document.getElementById('firmaArrendatario');
    img.src = ev.target.result;
    img.style.display = 'block';
    // Oculta el input para que no se pueda subir otra imagen
    document.getElementById('inputFirmaArrendatario').style.display = 'none';
  };
  reader.readAsDataURL(file);
});



