import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Card } from 'src/app/models/card.model';
import { Month } from 'src/app/models/month.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateCardComponent } from 'src/app/shared/component/add-update-card/add-update-card.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  user: User
  month: Month
  cards = []
  isPenaltyApplicable?: boolean
  currentDate: Date = new Date();

  form = new FormGroup({
    cards: new FormControl(),
  })

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    if (!this.utilsSvc.getMonth()) this.utilsSvc.routerLink("", true)
    else this.getMonth()
    this.getCards()
  }

  ionViewWillEnter() {
  }

  // AGREGAR O EDITAR TARJETAS
  async addUpdateCard(card?: Card) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateCardComponent,
      cssClass: "add-update-modal",
      componentProps: { card }
    })
    if (success) this.getCards()
  }

  routerLink(url: string) {
    if (this.form.value.cards) {
      this.utilsSvc.setCard( this.form.value.cards as Card )
      this.utilsSvc.routerLink(url)
    }else {
      this.utilsSvc.presentToast(
        {
          message: `Seleccione una tarjeta`,
          duration: 1500,
          icon: 'information-circle-outline',
          color: 'warning',
          position: 'middle'
        }
      )
    }
  }

  // OBTNER EL MES SELECCIONADO EN HOME
  getMonth(){
    this.month = this.utilsSvc.getMonth()
    this.getPenalty()
  }

  // DETERMINA SI SE ESTA APLICANDO UN RECARGO POR MORA
  getPenalty() {    
    const dueDate = new Date(this.month.dueDate)
    this.isPenaltyApplicable = this.currentDate > dueDate;
  }

  // OBTENER EL LISTADO DE TARJETAS DEL USUARIO
  getCards() {
    let path = `users/${this.user.uid}/cards`
    let query = []

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.cards = res
        sub.unsubscribe()
      }
    })
  }
}
