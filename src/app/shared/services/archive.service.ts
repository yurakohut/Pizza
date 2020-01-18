import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('archive').snapshotChanges();
  };

  deleteArray(orders: Array<IOrder>) {
    orders.forEach((value) => {
      this.firestore.doc('archive/' + value.id).delete();
    });
  };
  
  setData(order: IOrder): void {
    this.firestore.collection('archive').add(JSON.parse(JSON.stringify(order)));
  };
}
