import { Component, OnInit } from '@angular/core';
import { faPhoneAlt, faMapMarkerAlt, faClock, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-contacts',
  templateUrl: './home-contacts.component.html',
  styleUrls: ['./home-contacts.component.css']
})
export class HomeContactsComponent implements OnInit {
  faPhoneAlt = faPhoneAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faPizzaSlice = faPizzaSlice;
  constructor() { }

  ngOnInit() {
  }
 
}
