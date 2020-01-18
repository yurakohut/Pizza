import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ICategory } from '../interfaces/category.interface';
import { Product } from '../classes/product.model';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: AngularFirestore) { }
  getData(): any {
    return this.firestore.collection('categories').snapshotChanges();
  };
  
  deleteData(cloud: ICategory): void {
    this.firestore.doc('categories/' + cloud.id).delete();
  };

  deleteArrayOfProducts(products: Array<IProduct>) {
    products.forEach((value) => {
      this.firestore.doc('products/' + value.id).delete();
    });
  };

  setData(newCategory): void {
    this.firestore.collection('categories').add(JSON.parse(JSON.stringify(newCategory)))
  };
}
