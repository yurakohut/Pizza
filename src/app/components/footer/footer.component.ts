import { Component, OnInit } from '@angular/core';
import { faPhoneAlt, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faClock = faClock;
  faMapMarkerAlt = faMapMarkerAlt;
  faPhoneAlt = faPhoneAlt;
  constructor() { }

  ngOnInit() {
  }

}
