import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  constructor(private firestore: AngularFirestore) { }

  getData(): any {
    return this.firestore.collection('products/').snapshotChanges();
  };

}
