import { Component, OnInit, inject } from '@angular/core';
import { PdfService } from '../../../services/pdf.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Month } from 'src/app/models/month.model';
import { Card } from 'src/app/models/card.model';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { environment } from 'src/environments/environment.prod';
import emailjs from '@emailjs/browser'

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.page.html',
  styleUrls: ['./payment-confirm.page.scss'],
})
export class PaymentConfirmPage implements OnInit {

  public payPalConfig?: IPayPalConfig;
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
    if (!this.utilsSvc.getMonth()) this.utilsSvc.routerLink("/main/home", true)
    else this.getMonth()
    this.getCard()
    this.initConfig()
  }

  ionViewWillEnter() {
    if (!this.utilsSvc.getMonth()) this.utilsSvc.routerLink("/main/home", true)
  }

  // OBTENER EL MES SELECCIONADO EN HOME
  getMonth() {
    this.month = this.utilsSvc.getMonth()
    console.log(this.month);
  }

  // OBTENER LA TARJETA SELECCIONADOA EN HOME
  getCard() {
    this.card = this.utilsSvc.getCard()
  }

  // GENERA EL PATH PARA LA ACUTALIZACIÓN DE DATOS EN FIRESTORE
  getPath() {
    const path: string = `users/${this.user.uid}/semesters/${this.semester.cycle}-${this.semester.year}/payments/${this.month.id}`
    return path
  }

  // async submit() {
  //   await this.generarPDF()
  // }

  // ACTUALIZA LOS DATOS DE MONTH
  async updatePaidInfo(ticketUrl: any) {
    const loading = await this.utilsSvc.loading()
    await loading.present()
    delete this.month.totalFee
    this.month.paid = true
    this.month.card = this.card.id
    this.month.cardNumber = this.card.number
    this.month.cardExpDate = this.card.expDate
    this.month.paidDate = `${this.currentDate.getFullYear()}/${this.currentDate.getMonth() + 1}/${this.currentDate.getDate()}`
    this.month.ticketUrl = ticketUrl
    await this.firebaseSvc.updateDocument(this.getPath(), this.month).then(async (res) => {
      console.log(res);
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      loading.dismiss()
    })
  }

  // GENERACION DE PDF
  async generarPDF(transactionData: any) {
    const loading = await this.utilsSvc.loading()
    await loading.present()
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
        <h1 style="color: #000000; font-size: 10px; margin: 5px;">Recibo # ${transactionData.id}</h1>
        <h6 style="color: #000000; font-size: 10px; margin: 5px;">Pago Cuota de ${this.month.id}</h6>
        <p style="color: #000000; font-size: 10px; margin: 5px;">Direccion: Barrio San Jacinto</p>
        <h6 style="color: #000000; font-size: 10px; margin: 5px;">Univeridad Luterana Salvadoreña</h6>
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

    await this.pdfService.generarPdf(htmlContent, Date.now().toString(), headers, data, foot, 240, 450)
    .then(async (downloadURL: string) => {
      this.updatePaidInfo(downloadURL)
      this.sendEmail(downloadURL)
      this.utilsSvc.presentToast({
        message: `Pago realizado exitosamente`,
        duration: 1500,
        icon: 'checkmark-circle-outline',
        color: 'success',
        position: 'middle'
      })
      this.utilsSvc.routerLink("/main/home", true)
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      loading.dismiss()
    })
  }

  sendEmail(downloadURL: string){
    emailjs.init(environment.emailJs.options)
    const params = {
      to: this.user.email,
      link: downloadURL,
    }
    emailjs.send(environment.emailJs.serviceID, environment.emailJs.templateID, params).then((res) => {
      console.log('Correo enviado');
    }).catch((err) => {
      console.log('Error: ',err);
    })
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypal.clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.month.totalFee.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.month.totalFee.toString()
              }
            }
          },
          items: this.getItemList()
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.generarPDF(data)
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

  getItemList(): any[]{
    const items: any[] =[]
    let item = {}
    this.month.charges.forEach((i: any) => {
      item = {
        name: i.description,
        quantity: '1',
        category: 'DIGITAL_GOODS',
        unit_amount: {
          currency_code: 'USD',
          value: i.fee.toString()
        }
      }
      items.push(item)
    })
    return items
  }
}
