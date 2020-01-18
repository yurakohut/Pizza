import { Component, OnInit } from '@angular/core';
import {
  trigger,

  transition,
  useAnimation
} from '@angular/animations';
import { bounce, shake } from 'ng-animate';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  // animations: [
  //   trigger('popOverState', [
  //     state('show', style({
  //       opacity: 1
  //     })),
  //     state('hide', style({
  //       opacity: 0
  //     })),
  //     transition('show => hide', animate('600ms ease-out')),
  //     transition('hide => show', animate('1000ms ease-in'))
  //   ])
  // ]
  animations: [
    trigger('shake', [transition('void => *', useAnimation(shake)),
    transition('* => void', useAnimation(shake))
    ])
  ],
})
export class ContactsComponent implements OnInit {
  shake: any;
  visible: boolean = true;
  constructor() { }

  ngOnInit() {

  }
}
