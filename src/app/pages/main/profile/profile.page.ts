import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  loading: boolean = true

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl(''),
    carnet: new FormControl(''),
    carrera: new FormControl(''),
    role: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
  })


  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    this.form.setValue(this.user)
    this.enableForm(false)
    this.getCards()
  }

  // OBTENER EL LISTADO DE TARJETAS DEL USUARIO
  getCards() {
    this.loading = true
    let path = `users/${this.user.uid}/cards`
    let query = []

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.cards = res
        sub.unsubscribe()
        this.loading = false
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

  enableForm(enable: boolean) {
    if (enable) {
      this.form.get('name').enable()
      this.form.get('carrera').enable()
      this.form.get('carnet').enable()
    }else {
      this.form.get('name').disable()
      this.form.get('carrera').disable()
      this.form.get('carnet').disable()
    }
  }

  // ACTUALIZAR EMAIL DE UNA ESTUDIANTE
  async updateEMail() {
    let path = `users/${this.user.uid}`
    const loading = await this.utilsSvc.loading()
    await loading.present()
    this.enableForm(true)

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilsSvc.setInLocalStorage('user', this.form.value)
      this.utilsSvc.presentToast({
        message: "Correo actualizado",
        duration: 1500,
        icon: 'checkmark-circle-outline',
        color: 'success',
        position: 'middle'
      })
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        icon: 'alert-circle-outline',
        color: 'danger',
        position: 'middle'
      })
    }).finally(() => {
      this.enableForm(false)
      loading.dismiss()
    })
  }

}
