import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-custom-container',
  templateUrl: './custom-container.component.html',
  // template: `<ng-container *ngTemplateOutlet="template"></ng-container>
  // <ng-template #template>
  //   <div> {{ contenidoSvc.getContenido() }} </div>
  //   </ng-template>`,
  styleUrls: ['./custom-container.component.scss'],
})
export class CustomContainerComponent  implements OnInit {

  constructor(public utilsSvc: UtilsService) { }

  ngOnInit() {
    this.utilsSvc.setContenido(`Contenido generado con Servicios`)
  } 
}