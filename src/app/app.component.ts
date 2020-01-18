import { Component } from '@angular/core';
import * as AOS from 'aos'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pizza Restaurant';
  ngOnInit() {
    AOS.init({
      // once: true
    });
  }
  onActivate(event) {
    window.scroll(0, 0)
  }
}
