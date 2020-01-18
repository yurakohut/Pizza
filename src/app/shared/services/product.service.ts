import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct } from '../interfaces/product.interface';
import { IOrder } from '../interfaces/order.interface';
import { Observable, of, Subject } from 'rxjs';
import { ICategory } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('products').snapshotChanges();
  };

  deleteData(product: IProduct): void {
    this.firestore.doc('products/' + product.id).delete();
  };

  updateData(newProduct, id): void {
    this.firestore.doc('products/' + id).update(JSON.parse(JSON.stringify(newProduct)));
  };

  setData(newProduct): void {
    this.firestore.collection('products').add(JSON.parse(JSON.stringify(newProduct)));
  };

}

