import { Component, OnInit } from '@angular/core';
import { faHamburger, faCookie, faBreadSlice } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: ['./home-services.component.css'],

})
export class HomeServicesComponent implements OnInit {
  faHamburger = faHamburger;
  faCookie = faCookie;
  faBreadSlice = faBreadSlice;
  check: boolean = false;
  constructor() { }

  ngOnInit() {
  }
 
}
