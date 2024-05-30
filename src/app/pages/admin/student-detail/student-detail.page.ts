import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { orderBy } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddSemestersComponent } from 'src/app/shared/component/add-semesters/add-semesters.component';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.page.html',
  styleUrls: ['./student-detail.page.scss'],
})
export class StudentDetailPage implements OnInit {

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
    "Meatría en Gerencia Social",
  ]
  student: User
  semesters: any[] = []

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(10)]),
    carnet: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    carrera: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    role: new FormControl('estudiante'),
  })

  ngOnInit() {
    this.student = this.utilsSvc.getStudent()
  }
  
  ionViewWillEnter() {
    if (this.student) {
      this.getSemesters()
      this.form.setValue(this.student)
    }
  }

  // ACUTALIZAR LA INFORMACION DE UN ESTUDIANTE
  async updateStudent(){
    let path = `users/${this.student.uid}`
    const loading = await this.utilsSvc.loading()
    await loading.present()

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilsSvc.presentToast({
        message: "Estudiante actualizado exitosamente",
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

  // OBTENER LA LISTA DE CICLOS DE ESTUDIANTE
  async getSemesters() {
    let path = `users/${this.student.uid}/semesters`
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

  // AGREGAR CICLOS
  async addSemester(student: User){
    let success = await this.utilsSvc.presentModal({
    component: AddSemestersComponent,
    cssClass: "add-update-modal",
    componentProps: { student }
  })
  if (success) this.getSemesters()
  }

  // -------- ELIMINACION DE UNA SEMESTRE --------
  // ALERTA DE CONFIRMACION DE SEMESTRE
  async confirmDeleteSemesters(semester: any) {
    this.utilsSvc.presentAlert({
      header: '¡Eliminar Semestre!',
      message: '¿Quieres eliminar este Semestre?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteSemester(semester);
          }
        }
      ]
    })
  }
  // ELIMINACION DE SEMESTRE
  async deleteSemester(semester: any) {
    let path = `users/${this.student.uid}/semesters/${semester.id}`

    const loading = await this.utilsSvc.loading()
    await loading.present()

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.getSemesters()
      this.utilsSvc.presentToast({
        message: "Semestre eliminado exitosamente",
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
