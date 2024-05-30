import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const noAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, state) => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  return new Promise((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (auth) {
        firebaseSvc.isAdmin().then(isAdmin => { // MANDAMOS A LLAMAR LA FUNCION QUE VALIDA SI EL USUARIO AUTENTICADO ES ADMIN
          if (!isAdmin) {   // SI NO ES ADMIN RESOLVEMOS LA PROMESA EN TRUE
            resolve(true)
          } else {    // DE LO CONTRARIO, ES DECIR, ES ADMIN, LO DIRECCIONAMOS A '/admin' Y RESOLVEMOS EN FALSE
            utilsSvc.routerLink('/admin', true)
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