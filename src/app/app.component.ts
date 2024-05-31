import { Component, inject } from '@angular/core';
import { TimerLoginService } from './services/timer-login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(
    private timerLogin: TimerLoginService,
  ) {}
}
