import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('blacklist').snapshotChanges();
  };
  setData(editedUser: IUser): void {
    this.firestore.collection('blacklist').add(JSON.parse(JSON.stringify(editedUser)))
  };
  updateData(editedUser: IUser, id: number): void {
    this.firestore.doc('users/' + id).update(JSON.parse(JSON.stringify(editedUser)));
  };
  deleteData(user: IUser): void {
    this.firestore.doc('blacklist/' + user.id).delete();
  };
}
