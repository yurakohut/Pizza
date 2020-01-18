import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from '../interfaces/user.interface';
import { User } from '../classes/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('users').snapshotChanges();
  };

  setData(newUser: User): void {
    const user = JSON.parse(JSON.stringify(newUser));
    this.firestore.collection('users').add(user);
  };
  
  updateData(editedUser, id, userPosts?): void {
    this.firestore.doc('users/' + id).update(JSON.parse(JSON.stringify(editedUser)));
    if (userPosts) {
      userPosts.forEach((value) => {
        this.firestore.doc('posts/' + value.id).delete();
      });
    }
  };

  setItemLocalStorage(item): void {
    localStorage.setItem('User', JSON.stringify([item]));
  };
}
