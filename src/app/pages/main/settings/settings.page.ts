import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  form = new FormGroup({
    language: new FormControl(),
    notification: new FormControl()
  })

  utilsSvc = inject(UtilsService)

  constructor() { }

  ngOnInit() {
    const settings = this.utilsSvc.getFromLocalStorage('settings')
    if (settings) {
      this.form.setValue({
        language: settings.language,
        notification: settings.notification
      })
      console.log(settings)
    }
  }

  saveSettings(){
    this.utilsSvc.setInLocalStorage('settings', this.form.value)
    console.log(this.form.value.language)
    console.log(this.form.value.notification)
    console.log("Datos guardados")
  }
}
