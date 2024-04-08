import { Component, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utilsSvc = inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }

  routerLink() {
    this.utilsSvc.routerLink("payment")
  }

}
