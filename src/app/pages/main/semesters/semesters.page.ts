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

  // OBTENER LA LISTA DE CICLOS DE ESTUDIANTE
  getSemesters() {
    let path = `users/${this.user.uid}/semesters`
    let query = [
      orderBy('year','desc'),
      orderBy('cycle','desc')
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.semesters = res
        sub.unsubscribe()
      }
    })
  }

  // OBTENER MESES DEL USUARIO
  getMonths() {
    let path = `users/${this.user.uid}/semesters/${this.form.value.semester}/payments`
    let query = [
      orderBy('dueDate','asc'),
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.months = res
        sub.unsubscribe()
        this.getFee()
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
}