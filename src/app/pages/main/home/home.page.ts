import { Component, OnInit, inject } from '@angular/core';
import { orderBy } from 'firebase/firestore';
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
  months = []
  user?: {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    this.getMonths()
  }

  ionViewWillEnter() {
    console.log(this.user);
  }

  routerLink(url: string, month: object) {
    console.log(month)
    this.utilsSvc.setData( month )
    this.utilsSvc.routerLink(url)
  }

  // OBTENER MESES DEL USUARIO
  getMonths() {
    let path = `users/tTgIAas7xjJrvU3cc68E/semesters/ciclo1/payments`
    let query = [
      orderBy('dueDate','asc')
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res)
        this.months = res
        sub.unsubscribe()
      }
    })
  }
}
