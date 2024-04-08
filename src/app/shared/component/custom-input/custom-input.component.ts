import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() formControl?: FormControl
  @Input() type?: string
  @Input() icon?: string
  @Input() label?: string
  @Input() autocomplete?: string = "off"
  constructor() { }

  ngOnInit() {}

}
