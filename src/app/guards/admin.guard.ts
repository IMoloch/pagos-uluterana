import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, state) => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  return new Promise((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        firebaseSvc.isAdmin().then(async isAdmin => { // MANDAMOS A LLAMAR LA FUNCION QUE VALIDA SI EL USUARIO AUTENTICADO ES ADMIN
          if (isAdmin) { // SI ES ADMIN RESOLVEMOS LA PROMESA EN TRUE
            resolve(true)
          } else { // SI NO ES ADMIN, LO DIRECCIONAMOS A '/main' Y RESOLVEMOS EN FALSE
            utilsSvc.routerLink('/main/home', true)
            resolve(false)
          }
        })
      } else {
        firebaseSvc.signOut()
        resolve(false)
      }
    })
  })
};
