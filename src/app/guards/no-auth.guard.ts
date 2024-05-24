import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { map } from 'rxjs';

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, state) => {
    const firebaseSvc = inject(FirebaseService);
    const utilsSvc = inject(UtilsService);
  
    return firebaseSvc.getAuthState().pipe(
      map((auth) => {
        // ========= No existe usuario autenticado ============
        if (!auth) {
          return true;
          // ========= Existe usuario autenticado ============
        } else {
          utilsSvc.routerLink('/main/home');
          return false;
        }
      })
    );
};
