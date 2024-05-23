import { Component } from '@angular/core';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.page.html',
  styleUrls: ['./payment-confirm.page.scss'],
})
export class PaymentConfirmPage {
  constructor(private pdfService: PdfService) { }

  generarPDF() {
    const htmlContent = `
      <div style="width: 120px; background: #ffffff; text-align: center;">
        <img src="assets/img/logoUls.png" alt="Logo ULS" width="50px" height="20px">
        <h1 style="color: #000000; font-size: 5px; margin: 0;">Recibo # 5488</h1>
        <h6 style="color: #000000; font-size: 5px; margin: 0;">Pago cuota de abril</h6>
        <p style="color: #000000; font-size: 5px; margin: 0;">Direccion: Barrio San Jacinto</p>
        <h6 style="color: #000000; font-size: 5px; margin: 0;">Univeridad luterana salvadoreña</h6>
        <h6 style="color: #000000; font-size: 5px; margin: 0;">NIT: 0097-889898-106-9</h6>
        <h6 style="color: #000000; font-size: 5px; margin-top: 0;">NCR: 998767-0 </h6>
        <p style="color: #000000; font-size: 5px;">Carnet: MZI00135767</p>
        <p style="color: #000000; font-size: 5px;">Carrera: Ciencias de la computacion</p>
        <p style="color: #000000; font-size: 5px;">Alumno: Noemy Mejia:</p>
        <p style="color: #000000; font-size: 5px;">Ciclo: 1-2024</p>
        <p style="color: #000000; font-size: 5px;">Fecha pago: 2024-04-13</p>
        <p style="color: #000000; font-size: 5px;">Fecha transaccion: 2024-04-13</p>
        <table style="width: 80%; font-size: 5px; border-collapse: collapse;  margin-left: auto; margin-right: auto;">
          <thead style="background-color: #ffffff;">
            <tr>
              <p style="color: #000000; margin: 3px;">--------------------</p>
              <th scope="col" style="color: #000000;">Número</th>
              <th scope="col" style="color: #000000;">Concepto</th>
              <th scope="col" style="color: #000000;">Valor</th>
              <th scope="col" style="color: #000000;">Mes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row" style="color: #000000;">1</td>
              <td style="color: #000000;">Pago de servicios</td>
              <td style="color: #000000;">$45.00</td>
              <td style="color: #000000;">Abril</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <th scope="row" colspan="1" style="color: #000000;">Total</th>
              <td style="color: #000000;">$45.00</td>
            </tr>
          </tfoot>
        </table>
        <p style="font-size: 5px;">Tipo de pago: Tarjeta Debito/Creidto</p>
      </div>
    `;
    this.pdfService.generarPdf(htmlContent, 'confirmacion_pago', 120, 210);
  }
}
