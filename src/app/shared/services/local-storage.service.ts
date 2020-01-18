import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  ordersStream: Subject<Array<IProduct>> = new Subject<Array<IProduct>>();
  constructor(private route: Router) { }

  addProductLocalStorage(newProduct: IProduct): void {
    let products = this.getDataLocalStorage('Products');
    if (products.length > 0) {
      if (products.find(elem => elem.id === newProduct.id)) {
        const index = (products as Array<any>).findIndex(elem => elem.id === newProduct.id);
        products[index].count += newProduct.count
      }
      else {
        products.push(newProduct);
      }
    }
    else {
      products = [newProduct]
    }
    this.setProductLocalStorage(products);
  }

  getDataLocalStorage(subject): any {
    if (localStorage.length > 0 && localStorage.getItem(subject)) {
      return JSON.parse(localStorage.getItem(subject));
    }
    else {
      return [];
    }
  };

  setProductLocalStorage(item): void {
    localStorage.setItem('Products', JSON.stringify(item));
    this.getOrderCount(item);
  };

  getOrderCount(newProd): void {
    this.ordersStream.next(newProd);
  };

  setUserLocalStorage(item): void {
    localStorage.setItem('User', JSON.stringify([item]));
  };

}
