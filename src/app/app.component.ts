import { Component, inject } from '@angular/core';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  utilsSvc = inject(UtilsService)
  settings?: object = this.utilsSvc.getFromLocalStorage('settings')
  
  constructor() {
    if (!this.settings) {
      this.utilsSvc.setInLocalStorage('settings',  {
        "language": "español",
        "notification": false
      })
    }
  }
}
