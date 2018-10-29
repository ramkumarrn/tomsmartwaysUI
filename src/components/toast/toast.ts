import { Component } from '@angular/core';

/**
 * Generated class for the ToastComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'toast',
  templateUrl: 'toast.html'
})
export class ToastComponent {

  text: string;

  constructor() {
    console.log('Hello ToastComponent Component');
    this.text = 'Hello World';
  }

}
