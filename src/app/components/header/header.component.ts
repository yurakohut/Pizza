import { Component, OnInit } from '@angular/core';
import { faBars, faTimes, faPizzaSlice, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnInit {
  faBars = faBars;
  faTimes = faTimes;
  faPizzaSlice = faPizzaSlice;
  faShoppingBasket = faShoppingBasket;
  orderCount: number;
  menuCheck: boolean;

  constructor(private localStorage: LocalStorageService) {
    this.getCount();
  };

  //число замовлень, яке відображаться через matBadge
  ngOnInit() {
    this.orderCount = this.localStorage.getDataLocalStorage('Products').length;
  };

  getCount(): void {
    this.localStorage.ordersStream.subscribe(data => this.orderCount = data.length);
  };

}
