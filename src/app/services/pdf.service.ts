import { Injectable, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  firebaseSvc = inject(FirebaseService)

  async generarPdf(htmlContent: string, filename: string, headers: any, data:any, foot:any, width: number, height: number) {
    const doc = new jsPDF({
      unit: 'px',
      format: [width, height] // Establece el tamaño del papel
    });
    autoTable(doc, {
      theme: 'plain',
      startY: 340,
      head: headers,
      body: data,
      foot: foot,
      headStyles: { fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      footStyles: { fontSize: 10 },
      columnStyles: {
        0: {cellWidth: 46, halign: 'center'},
        1: {cellWidth: 94},
        2: {cellWidth: 40},
        3: {cellWidth: 40},
      },
      tableWidth: 220,
      margin: {left: 10, right: 10, top: 3},
    })
    return new Promise((resolve, reject) => {
      doc.html(htmlContent, {
        callback: async (pdf) => {
          const pdfBlob = pdf.output('blob')
          
          try {
            // Subir el Blob a Firebase Storage y obtener la URL de descarga
            const downloadURL = await this.firebaseSvc.uploadPdfToStorage(pdfBlob, filename);
            resolve (downloadURL) // Devolvemos URL del PDF
          } catch (error) {
            console.error('Error al generar o subir el PDF:', error)
            reject (error)
          }
        }
      });
    })
    
  }
}
