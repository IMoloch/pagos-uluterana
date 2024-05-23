import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Month } from 'src/app/models/month.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  router = inject(Router)
  user: User
  month: Month
  isPenaltyApplicable?: boolean

  currentDate: Date = new Date();

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    this.getFee()
    this.getPenalty()
  }

  // OBTENER LA SUMA DE LOS CARGOS DEL MES
  getFee(){
    this.month = this.utilsSvc.getData()
    let totalFee = this.month.charges.reduce((accumulator, currentNumber) => {
      return accumulator + currentNumber.fee
    }, 0)
    this.month.totalFee = totalFee
    console.log(this.month);
  }

  // DETERMINA SI SE ESTA APLICANDO UN RECARGO POR MORA
  getPenalty() {    
    const dueDate = new Date(this.month.dueDate)
    this.isPenaltyApplicable = this.currentDate > dueDate;
  }


}
