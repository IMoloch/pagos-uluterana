import { Component, OnInit, inject } from '@angular/core';
import { orderBy, where } from 'firebase/firestore';
import { Month } from 'src/app/models/month.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  user: User
  months: Month[] = []

  currentDate: Date = new Date();
  semester = {
    year: this.currentDate.getFullYear(),
    cycle: this.currentDate.getMonth() < 7 ? 1 : 2 
  }
  

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
  }
  
  ionViewWillEnter() {
    this.getMonths()
  }

  routerLink(url: string, month: Month) {
    this.utilsSvc.setMonth( month as Month )
    this.utilsSvc.routerLink(url)
  }

  // OBTENER MESES DEL USUARIO
  getMonths() {
    let path = `users/${this.user.uid}/semesters/${this.semester.cycle}-${this.semester.year}/payments`
    let query = [
      orderBy('dueDate','asc'),
      where('paid',"==",false)
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

  async copyDocument() {
    try {
      await this.firebaseSvc.copyDocumentWithSubcollections(
        'users/tTgIAas7xjJrvU3cc68E',
        'users/T4XHqJgD4KTk2drb6haibK23IC92'
      );
      console.log('Document copied successfully');
    } catch (error) {
      console.error('Error copying document: ', error);
    }
  }
}
