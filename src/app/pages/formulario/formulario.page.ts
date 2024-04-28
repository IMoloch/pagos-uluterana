import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
  currentDate: Date = new Date();
  isPenaltyApplicable: boolean = this.currentDate.getDate() > 30;
  penaltyAmount: number = this.isPenaltyApplicable ? 5 : 0;

  studentName: string = '';
  cycleToPay: string = '';
  carrera: string = '';

  constructor(private router: Router) { } 

  ngOnInit() {
    
  }

  onSubmit() {
    
    this.router.navigateByUrl('/payment');
  }
}
