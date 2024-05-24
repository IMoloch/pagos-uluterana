import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Month } from '../models/month.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  
  month: Month
  card: Card
  
  loadingCtrl = inject(LoadingController)
  modalCtrl = inject(ModalController)
  toastCtrl = inject(ToastController)
  alertCtrl = inject(AlertController)
  router = inject(Router)
  
  routerLink(url: string, replace: boolean = false) {
    return this.router.navigate([url], { replaceUrl: replace })
  }
  
  /* Template del Loading
    {
      message: "Producto eliminado exitosamente",
      duration: 1500,
      icon: 'checkmark-circle-outline',
      color: 'success',
      position: 'middle'
    }
  */
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingCtrl.create(opts);
    await loading.present();
  }


  async dismissLoading() {
    return await this.loadingCtrl.dismiss();
  }

  /* Template del Toast
    {
      message: `Te damos la bienvenida ${user.name}`,
      duration: 1500,
      icon: 'person-outline',
      color: 'primary',
      position: 'middle'
    }
  */
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts)
    await toast.present()
  }

  /* Template del Modal
    {
      let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: "add-update-modal",
      componentProps: { product }
    })

    if (success) this.getProducts()
    }
  */
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts)
    await modal.present()

    const { data } = await modal.onWillDismiss()
    if (data) return data
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data)
  }

  /* Template de las Alerta
    {
      header: 'Eliminar Producto!',
      message: '¿Quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
    }
  */
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts)
    await alert.present()
  }

  // --------- FUNCIONES DEL LOCAL STORAGE ---------
  setInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  deleteFromLocalStorage(key: string) {
    return localStorage.removeItem(key)
  }

  // --------- GET Y SET DEL MES ---------
  setMonth(month: Month){
    this.month = month
  }

  getMonth(){
    return this.month as Month
  }

  // --------- GET Y SET DE LA TARJETA ---------
  setCard(card: Card){
    this.card = card
  }

  getCard(){
    return this.card as Card
  }
}
