import { Component, OnInit, inject } from '@angular/core';
import { Card } from 'src/app/models/card.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateCardComponent } from 'src/app/shared/component/add-update-card/add-update-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  user: User
  cards: Card[] = []


  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    this.getCards()
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

  // AGREGAR O EDITAR TARJETAS
  async addUpdateCard(card?: Card) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateCardComponent,
      cssClass: "add-update-modal",
      componentProps: { card }
    })
    if (success) this.getCards()
  }
}
