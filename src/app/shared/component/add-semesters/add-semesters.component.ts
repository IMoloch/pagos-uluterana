import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Month } from 'src/app/models/month.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-semesters',
  templateUrl: './add-semesters.component.html',
  styleUrls: ['./add-semesters.component.scss'],
})
export class AddSemestersComponent implements OnInit {

  @Input() student: User
  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  years = []
  currentDate = new Date()
  minYear = 2024

  form = new FormGroup({
    cycle: new FormControl<number>(1),
    year: new FormControl<number>(this.currentDate.getFullYear())
  });

  ngOnInit() {
    for (let year = this.currentDate.getFullYear(); year >= this.minYear; year--) {
      this.years.push(year)
    }
  }

  async addSemester() {
    let path = `users/${this.student.uid}/semesters/${this.form.value.cycle}-${this.form.value.year}`

    const loading = await this.utilsSvc.loading()
    await loading.present()

    this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
      await this.addMonths()
      this.utilsSvc.dismissModal({
        success: true
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

  async addMonths() {
    if (this.form.value.cycle === 1) {
      var months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio']
      let path = `users/${this.student.uid}/semesters/${this.form.value.cycle}-${this.form.value.year}/payments/inscripcion`
      let month: Month = {
        dueDate: `${this.form.value.year}/1/30`,
        paid: false,
        charges: [
          {
            description: "Matricula Ordinaria",
            fee: 30,
          },
          {
            description: "Derecho de Prácticas",
            fee: 15,
          },
          {
            description: "Gastos Administrativos",
            fee: 16,
          },
          {
            description: "Seguro Accidentes",
            fee: 6.5,
          }
        ]
      }
      await this.firebaseSvc.setDocument(path, month as Month).then(async res => { })
      months.forEach((monthId, i) => {
        let path = `users/${this.student.uid}/semesters/${this.form.value.cycle}-${this.form.value.year}/payments/${monthId}`
        let month: Month = {
          dueDate: `${this.form.value.year}/${i + 2}/05`,
          paid: false,
          charges: [
            {
              description: "Cuota Ordinaria",
              fee: 45,
            }
          ]
        }
        const dueDate = new Date(month.dueDate)
        if (this.currentDate > dueDate) month.charges.push({ description: "Mora", fee: 5})
        this.firebaseSvc.setDocument(path, month as Month).then(async res => { })
      })
    } else {
      var months = ['julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      let path = `users/${this.student.uid}/semesters/${this.form.value.cycle}-${this.form.value.year}/payments/inscripcion`
      let month: Month = {
        dueDate: `${this.form.value.year}/7/30`,
        paid: false,
        charges: [
          {
            description: "Matricula Ordinaria",
            fee: 30,
          },
          {
            description: "Derecho de Prácticas",
            fee: 15,
          },
          {
            description: "Gastos Administrativos",
            fee: 16,
          },
          {
            description: "Seguro Accidentes",
            fee: 6.5,
          }
        ]
      }
      await this.firebaseSvc.setDocument(path, month as Month).then(async res => { })
      months.forEach((monthId, i) => {
        let path = `users/${this.student.uid}/semesters/${this.form.value.cycle}-${this.form.value.year}/payments/${monthId}`
        if (months[i] === "diciembre") {
          let month: Month = {
            dueDate: `${this.form.value.year + 1}/01/05`,
            paid: false,
            charges: [
              {
                description: "Cuota Ordinaria",
                fee: 45,
              }
            ]
          }
          const dueDate = new Date(month.dueDate)
          if (this.currentDate > dueDate) month.charges.push({ description: "Mora", fee: 5})
          this.firebaseSvc.setDocument(path, month as Month).then(async res => { })
        } else {
          let month: Month = {
            dueDate: `${this.form.value.year}/${i + 8}/05`,
            paid: false,
            charges: [
              {
                description: "Cuota Ordinaria",
                fee: 45,
              }
            ]
          }
          const dueDate = new Date(month.dueDate)
          if (this.currentDate > dueDate) month.charges.push({ description: "Mora", fee: 5})
          this.firebaseSvc.setDocument(path, month as Month).then(async res => { })
        }
      })
    }
  }
}
