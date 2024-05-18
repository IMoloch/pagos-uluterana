import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl
  @Input() type?: string
  @Input() icon?: string
  @Input() label?: string
  @Input() autocomplete?: string

  isPassword!: boolean;
  hide: boolean = true;

  constructor() { }

  ngOnInit() {
    if (this.type == 'password') this.isPassword = this.isPassword = true;
  //   console.log('Type:', this.type);
  //   console.log('Autocomplete:', this.autocomplete);
  //   console.log('Label:', this.label);
  //   console.log('Control:', this.control);
  }
    showOrHidePassword(){
      this.hide = !this.hide;

      if (this.hide) this.type = 'password'
      else this.type = 'text';
  }

}
