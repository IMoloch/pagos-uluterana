import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generarPdf(htmlContent: string, filename: string, width: number, height: number) {
    const doc = new jsPDF({
      unit: 'px',
      format: [width, height] // Establece el tamaño del papel
    });
    
    doc.html(htmlContent, {
      callback: function (pdf) {
        const pdfBlob = pdf.output('blob')
        const url = URL.createObjectURL(pdfBlob)
        window.open(url, '_blank')
        // pdf.save(filename + '.pdf');
      }
    });
  }
}
