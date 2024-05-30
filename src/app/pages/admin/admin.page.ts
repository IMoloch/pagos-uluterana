import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { orderBy } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  students: User[] = []
  users: User[] = []
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
  form = new FormGroup({
    carrera: new FormControl("Todos"),
  })

  ngOnInit() {
    this.getStudents()
  }

  ionViewWillEnter() {
    this.getStudents()
  }

  // OBTENER MESES DEL USUARIO
  getStudents() {
    let path = `users`
    let query = [
      orderBy('carrera','asc')
    ]

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        this.users = res
        this.getStudentsFiltered()
        sub.unsubscribe()
      }
    })
  }

  getStudentsFiltered(){
    if (this.form.value.carrera === "Todos") {
      this.students = this.users
    } else {
      this.students = this.users
        .filter(data => data.carrera === `${this.form.value.carrera}`)
    }   
  }

  // AGREGAR O EDITAR ESTUDIANTES
  async addUpdateStudent(url: string, student?: User){
    this.utilsSvc.setStudent( student as User )
    this.utilsSvc.routerLink(url, false)
  }

}
