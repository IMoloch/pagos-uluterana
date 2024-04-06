import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private contenidoActual?: string

  constructor(private router: Router) { }

  getContenido() {
      return this.contenidoActual
  }

  setContenido(nuevoContenido: any){
      this.contenidoActual = nuevoContenido
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url)
  }
}
