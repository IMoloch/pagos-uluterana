import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utilsSvc = inject(UtilsService)
  data = [
    {
      name: "Javi",
      ciclo: "1",
      carrera: "Lic. Computación"
    },
    {
      name: "Javi",
      ciclo: "2",
      carrera: "Lic. Computación"
    },
    {
      name: "Javi",
      ciclo: "3",
      carrera: "Lic. Computación"
    },
    {
      name: "Javi",
      ciclo: "4",
      carrera: "Lic. Computación"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  routerLink(url: string, dato: object) {
    console.log(dato)
    this.utilsSvc.setData({ dato })
    this.utilsSvc.routerLink(url)
  }

}
