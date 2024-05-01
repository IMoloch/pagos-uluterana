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
  data?: any

  currentDate: Date = new Date();
  isPenaltyApplicable: boolean = this.currentDate.getDate() > 30;
  penaltyAmount: number = this.isPenaltyApplicable ? 5 : 0;

  studentName: string = '';
  cycleToPay: string = '';
  carrera: string = ''; 

  ngOnInit() {
    this.utilsSvc.getData().subscribe((data) => this.data = data)
    this.studentName = this.data.dato.name
    this.cycleToPay = this.data.dato.ciclo
    this.carrera = this.data.dato.carrera
    console.log(this.data)
  }

  onSubmit() {
    this.router.navigateByUrl('/payment');
  }
}
