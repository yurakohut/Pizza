import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IGuest } from '../interfaces/guest.interface';


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('guests').snapshotChanges();
  };
  deleteData(cloud: IGuest): void {
    this.firestore.doc('guests/' + cloud.id).delete();
  };
  updateData(newGuest, id): void {
    this.firestore.doc('guests/' + id).update(JSON.parse(JSON.stringify(newGuest)));
  };

  setData(newGuest): void {
    this.firestore.collection('guests').add(JSON.parse(JSON.stringify(newGuest)))
  };

  getType(): any {
    return this.firestore.collection('types').snapshotChanges();
  };
  updateType(newType, id): void {
    this.firestore.doc('types/' + id).update(JSON.parse(JSON.stringify(newType)));
  };

}
