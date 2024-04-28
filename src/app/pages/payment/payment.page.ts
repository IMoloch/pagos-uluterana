import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  utilsSvc = inject(UtilsService)
  router = inject(Router)

  currentDate: Date = new Date();
  isPenaltyApplicable: boolean = this.currentDate.getDate() > 30;
  penaltyAmount: number = this.isPenaltyApplicable ? 5 : 0;

  studentName: string = '';
  cycleToPay: string = '';
  carrera: string = ''; 

  ngOnInit() {
    
  }

  onSubmit() {
    this.router.navigateByUrl('/payment');
  }
}
