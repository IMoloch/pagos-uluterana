import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { orderBy, where } from 'firebase/firestore';
import { Month } from 'src/app/models/month.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-semesters',
  templateUrl: './semesters.page.html',
  styleUrls: ['./semesters.page.scss'],
})
export class SemestersPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  loadingSemesters: boolean = true
  loadingMonths: boolean = true
  user: User
  semesters: any[] = []
  months: Month[] = []

  form = new FormGroup({
    semester: new FormControl(),
  })

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
  }
  
  ionViewWillEnter() {
    this.getSemesters()
  }

  // REDIRECCION A PAYMENTS
  routerLink(url: string, month: Month) {
    this.utilsSvc.setMonth( month as Month )
    this.utilsSvc.routerLink(url)
  }

  // OBTENER LA LISTA DE CICLOS DE ESTUDIANTE
  getSemesters() {
    this.loadingSemesters = true
    let path = `users/${this.user.uid}/semesters`
    let query = [
      orderBy('year','desc'),
      orderBy('cycle','desc')
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.semesters = res
        sub.unsubscribe()
        this.loadingSemesters = false
      }
    })
  }

  // OBTENER MESES DEL USUARIO
  getMonths() {
    this.loadingMonths = true
    let path = `users/${this.user.uid}/semesters/${this.form.value.semester}/payments`
    let query = [
      orderBy('dueDate','asc'),
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.months = res
        sub.unsubscribe()
        this.getFee()
        this.loadingMonths = false
      }
    })
  }

  // OBTENER EL TOTAL FEE Y AGREGARLO AL ARRAY MONTHS
  getFee(){
    this.months.forEach((month) => {
      let totalFee = month.charges.reduce((accumulator, currentNumber) => {
        return accumulator + currentNumber.fee
      }, 0)
      month.totalFee = totalFee
    })
  }

  // ABRIR EL PDF EN UNA PAGINA
  openPDF(url: string){
    if (url) {
      window.open(url, '_blank');
    }else{
      console.error("No existe el documento");
      this.utilsSvc.presentToast(
        {
          message: `Comprobante no disponible`,
          duration: 1500,
          icon: 'close-circle-outline',
          color: 'danger',
          position: 'middle'
        }
      )
    }
  }
}