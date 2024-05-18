import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, state) => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  return firebaseSvc.getAuthState().pipe(
    map(auth => {
      // ========= Existe usuario autenticado ============
      if (auth) {
        return true;
        // ========= No existe usuario autenticado ============ 
      } else {
        utilsSvc.routerLink('/auth');
        return false;
      }
    }))
};
