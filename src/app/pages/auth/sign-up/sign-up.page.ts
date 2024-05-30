import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  carreras = [
    "Ingeniería Agroecológica",
    "Licenciatura en Administración de Empresas",
    "Licenciatura en Ciencias de la Computación",
    "Licenciatura en Ciencias Jurídicas",
    "Licenciatura en Contaduría Pública",
    "Técnico en Desarrollo de Aplicaciones Informáticas",
    "Técnico en Ingeniería Agroecológica",
    "Licenciatura en Idioma Inglés",
    "Licenciatura en Psicología",
    "Licenciatura en Trabajo Social",
    "Licenciatura en Teología",
    "Maestría en Gerencia Social",
  ]

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(10)]),
    carnet: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    carrera: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('estudiante'),
  })

  ngOnInit() {
  }
  // AÑADIR UN ESTUDIANTE NUEVO
  async createStudent(){
    const loading = await this.utilsSvc.loading()
    await loading.present()

    this.form.patchValue( {carnet: this.form.value.carnet.toUpperCase()})
    let user = {
      email: `${this.form.value.carnet.toLowerCase()}@uls.edu.sv`,
      password: this.form.value.password
    }

    this.firebaseSvc.signUp(user as User).then(async res => {
      let uid = res.user.uid
      this.form.controls.uid.setValue(uid)
      this.setUserInfo(uid)
    }).catch(error => {
      console.error(error)
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

  // CREA EL DOCUMENTO EN LA COLECCION USERS
  async setUserInfo(uid: string) {
    const loading = await this.utilsSvc.loading()
    await loading.present() 

    let path = `users/${uid}`
    delete this.form.value.password

    this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
      this.utilsSvc.setInLocalStorage('user', this.form.value);
      this.utilsSvc.routerLink('/main/home')
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
