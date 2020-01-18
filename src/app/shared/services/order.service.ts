import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: AngularFirestore) { }

  getData(): any {
    return this.firestore.collection('orders').snapshotChanges();
  };

  deleteData(cloud: IOrder): void {
    this.firestore.doc('orders/' + cloud.id).delete();
  };

  updateData(newOrder, id): void {
    this.firestore.doc('orders/' + id).update(JSON.parse(JSON.stringify(newOrder)));
  };

  setData(newOrder): void {
    this.firestore.collection('orders').add(JSON.parse(JSON.stringify(newOrder)));
  }
}
