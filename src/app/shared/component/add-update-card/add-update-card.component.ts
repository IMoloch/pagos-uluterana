import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Card } from 'src/app/models/card.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-card',
  templateUrl: './add-update-card.component.html',
  styleUrls: ['./add-update-card.component.scss'],
})
export class AddUpdateCardComponent implements OnInit {

  @Input() card: Card

  form = new FormGroup({
    id: new FormControl(''),
    number: new FormControl<number | null>(null, [Validators.required, Validators.minLength(13)]),
    name: new FormControl('', [Validators.required]),
    expDate: new FormControl('', [Validators.required]),
    cvv: new FormControl<number | null>(null, [Validators.required, , Validators.minLength(3)]),
  })

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  user: User

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    if (this.card) this.form.setValue(this.card)
      console.log(this.card);
      
  }

  ionViewWillLeave() {
    this.form.reset()
  }

  submit() {
    if (this.form.valid) {
      if (this.card) this.updateCard()
      else this.createCard()
    }
  }

  // CREAR UNA NUEVA TARJETA
  async createCard() {
    let path = `users/${this.user.uid}/cards`
    const loading = await this.utilsSvc.loading()
    await loading.present()

    delete this.form.value.id

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({
        success: true
      })
      this.utilsSvc.presentToast({
        message: "Tarjeta agregada exitosamente",
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
      loading.dismiss()
    })
  }

  // ACTUALIZAR DATOS DE UNA TARJETA
  async updateCard() {
    let path = `users/${this.user.uid}/cards/${this.card.id}`
    const loading = await this.utilsSvc.loading()
    await loading.present()

    delete this.form.value.id

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({
        success: true
      })
      this.utilsSvc.presentToast({
        message: "Tarjeta actualizada exitosamente",
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
      loading.dismiss()
    })
  }

  // -------- ELIMINACION DE UNA TARJETA
  // 
  async confirmDeleteProduct() {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Tarjeta!',
      message: '¿Quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct();
          }
        }
      ]
    })
  }

  async deleteProduct() {
    let path = `users/${this.user.uid}/cards/${this.card.id}`
    
    const loading = await this.utilsSvc.loading()
    await loading.present()

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.utilsSvc.dismissModal({
        success: true
      })
      this.utilsSvc.presentToast({
        message: "Producto eliminado exitosamente",
        duration: 1500,
        icon: 'checkmark-circle-outline',
        color: 'success',
        position: 'middle'
      })
    }).catch(error => {
      console.log(error)
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        icon: 'alert-circle-outline',
        color: 'danger',
        position: 'middle'
      })
    }).finally(() => {
      loading.dismiss()
    })
  }
}
