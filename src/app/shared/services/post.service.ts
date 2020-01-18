import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IPost } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('posts').snapshotChanges();
  };
  
  deleteData(post: IPost): void {
    this.firestore.doc('posts/' + post.id).delete();
  };

  updateData(newPost, id): void {
    this.firestore.doc('posts/' + id).update(JSON.parse(JSON.stringify(newPost)));
  };

  setData(newPost): void {
    this.firestore.collection('posts').add(JSON.parse(JSON.stringify(newPost)))
  };
}
