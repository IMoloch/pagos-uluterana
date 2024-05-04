import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  data?: any

  currentDate: Date = new Date();
  isPenaltyApplicable: boolean = this.currentDate.getDate() > 30;
  penaltyAmount: number = this.isPenaltyApplicable ? 5 : 0;

  studentName?: string;
  cycleToPay?: string;
  carrera?: string; 

  ngOnInit() {
    this.utilsSvc.getData().subscribe((data) => {
      this.data = data
      this.getMonth(data['mes'])
    })
    
  }

  getMonth(path: string) {
    this.firebaseSvc.getDocument(path).then(res => {
      console.log(res);
    })
  }

  onSubmit() {
    this.router.navigateByUrl('/payment');
  }
}
