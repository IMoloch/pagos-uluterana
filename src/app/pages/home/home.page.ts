import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private utilsSvc: UtilsService) { }

  ngOnInit() {
  }

  test() {
    this.utilsSvc.routerLink("/payment")
  }

}
