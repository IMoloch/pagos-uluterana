import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class TimerLoginService {

  private timeoutDuration = 0.5 * 60 * 1000; // medio minuto
  private timeout: any;


  constructor(
    private router: Router, 
    private ngZone: NgZone,
    private utilsSvc: UtilsService,
    private firebaseSvc: FirebaseService,
  ) {
    this.resetTimeout();
    this.setupEventListeners();
  }


  // Para resetear el timpo de cierre de sesion a partir de las condiciones especificas en events
  private setupEventListeners() {
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimeout());
    });
  }


  // Para limpiar el tiempo y volver a iniciarlo el temporizador
  private resetTimeout() {
    this.clearTimeout();

    this.ngZone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.logout();
        });
      }, this.timeoutDuration);
    });
  }


  // Funcion para limpiar el conteo
  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  // Cierre de sersion por inactividad
  private logout() {
    this.firebaseSvc.signOut();
  }
}
