import { Component, OnInit, inject } from '@angular/core';
import { PdfService } from '../../../services/pdf.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Month } from 'src/app/models/month.model';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.page.html',
  styleUrls: ['./payment-confirm.page.scss'],
})
export class PaymentConfirmPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  pdfService = inject(PdfService)
  user: User
  month: Month
  card: Card

  currentDate: Date = new Date();
  semester = {
    year: this.currentDate.getFullYear(),
    cycle: this.currentDate.getMonth() < 7 ? 1 : 2
  }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    if (!this.utilsSvc.getMonth()) this.utilsSvc.routerLink("", true)
    else this.getMonth()
    this.getCard()
  }

  // OBTENER EL MES SELECCIONADO EN HOME
  getMonth() {
    this.month = this.utilsSvc.getMonth()
    console.log(this.month);
  }

  // OBTENER LA TARJETA SELECCIONADOA EN HOME
  getCard() {
    this.card = this.utilsSvc.getCard()
    this.firebaseSvc.getDocument
  }

  // GENERA EL PATH PARA LA ACUTALIZACIÓN DE DATOS EN FIRESTORE
  getPath() {
    const path: string = `users/${this.user.uid}/semesters/${this.semester.cycle}-${this.semester.year}/payments/${this.month.id}`
    return path
  }

  async submit() {
    const loading = await this.utilsSvc.loading()
    await loading.present()
    await this.generarPDF().finally(() => loading.dismiss())
  }

  async updatePaidInfo(ticketUrl: any) {
    delete this.month.totalFee
    this.month.paid = true
    this.month.card = this.card.id
    this.month.paidDate = `${this.currentDate.getFullYear()}/${this.currentDate.getMonth() + 1}/${this.currentDate.getDate()}`
    this.month.ticketUrl = ticketUrl
    await this.firebaseSvc.updateDocument(this.getPath(), this.month).then(async (res) => {
      console.log(res);
    }).catch(err => {
      console.log(err)
    })
  }

  // GENERACION DE PDF
  async generarPDF() {
    const headers = [['Número', 'Concepto', 'Valor', 'Mes']];
    let data = []
    for (let i = 0; i < this.month.charges.length; i++) {
      data.push(
        [`${i + 1}`, `${this.month.charges[i].description}`, `$ ${this.month.charges[i].fee}`, `${this.month.id}`]
      )
    }
    const foot = [
      ['', 'Total', `$ ${this.month.totalFee}`]
    ]
    const htmlContent = `
      <div style="width: 240px; background: #ffffff; text-align: center; margin-top: 10px">
        <img src="assets/img/logoUls.png" alt="Logo ULS" width="100px" height="40px">
        <h1 style="color: #000000; font-size: 10px; margin: 5px;">Recibo # 5488</h1>
        <h6 style="color: #000000; font-size: 10px; margin: 5px;">Pago Cuota de ${this.month.id}</h6>
        <p style="color: #000000; font-size: 10px; margin: 5px;">Direccion: Barrio San Jacinto</p>
        <h6 style="color: #000000; font-size: 10px; margin: 5px;">Univeridad luterana salvadoreña</h6>
        <h6 style="color: #000000; font-size: 10px; margin: 5px;">NIT: 0097-889898-106-9</h6>
        <h6 style="color: #000000; font-size: 10px; margin-top: 5px;">NCR: 998767-0 </h6>
        <p style="color: #000000; font-size: 10px;">Carnet: ${this.user.carnet}</p>
        <p style="color: #000000; font-size: 10px;">Carrera: ${this.user.carrera}</p>
        <p style="color: #000000; font-size: 10px;">Alumno: ${this.user.name}</p>
        <p style="color: #000000; font-size: 10px;">Ciclo: 01-2024</p>
        <p style="color: #000000; font-size: 10px;">Fecha pago: ${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}</p>
        <p style="color: #000000; font-size: 10px;">Fecha transaccion: ${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}</p>
        <p style="font-size: 10px;">Tipo de pago: Tarjeta Debito/Credito</p>
        <p style="color: #000000; margin: 3px;">----------------------------------------</p>
      </div>
    `;

    await this.pdfService.generarPdf(htmlContent, Date.now().toString(), headers, data, foot, 240, 450).then(async (downloadURL: string) => {
      this.updatePaidInfo(downloadURL)
      // Abrir el PDF en una nueva pestaña
      window.open(downloadURL, '_blank');
    }).catch(error => {
      console.log(error);
    })
  }
}
