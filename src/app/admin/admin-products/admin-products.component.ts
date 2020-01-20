import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/classes/product.model';
import { NotificationService } from 'src/app/shared/services/notification.service';



@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Array<IProduct> = [];
  categories: Array<ICategory> = [];
  productId: string;
  productCategory: string = '';
  productName: string;
  productDescription: string;
  productPrice: number;
  productCount: number = 1;
  productImage: string = '';
  productSize: number = null;
  productWeight: number = null;
  filterCategoryName: string;
  searchCategory: string = '';
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  urlImage: string;
  progress: boolean = false;
  modalRef: BsModalRef;
  modalRefWarning: BsModalRef;
  addProductCheck: boolean;
  selected: string;
  editProductImgBoolean: boolean = false;
  editSrc: string;
  deleteProduct: IProduct;
  editDisabled: boolean;
  searchProduct: string = '';
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private service: ProductService, private categoryService: CategoryService, private route: ActivatedRoute, private prStorage: AngularFireStorage, private firestore: AngularFirestore, private modalService: BsModalService, private notificationsService: NotificationService) { }

  ngOnInit() {
    this.service.getData().subscribe(actionArray => {
      this.products = actionArray.map(product => {
        return {
          id: product.payload.doc.id,
          ...product.payload.doc.data()
        };
      });
    });
    this.categoryService.getData().subscribe(actionArray => {
      this.categories = actionArray.map(category => {
        return {
          id: category.payload.doc.id,
          ...category.payload.doc.data()
        };
      });
    });
    this.selectCategory('');
  };
  //Завантаження фото
  public upload(event): void {
    this.editProductImgBoolean = false;
    const id = Math.random().toString(36).substring(2);
    this.progress = true;
    this.ref = this.prStorage.ref(`images/${id}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL()
        this.downloadURL.subscribe(url => this.productImage = url);
        this.progress = false;
        this.addProductCheck = true;
      })
    ).subscribe();

  }
  //Роблю кнопку категорії активною
  isActive(item) {
    return this.selected === item;
  };
  openProductModal(template: TemplateRef<any>): void {
    this.resetData();
    this.editDisabled = false;
    this.editProductImgBoolean = false;
    this.modalRef = this.modalService.show(template);
  };

  setData(): void {
    const newProduct: IProduct = new Product(this.productCategory, this.productName, this.productDescription, this.productPrice, this.productCount, this.productImage, this.productSize, this.productWeight);
    //Спрацьовує, коли починаю редагувати продукт, оскільки при редагування даю ID
    if (this.productId) {
      this.service.updateData(newProduct, this.productId);
      this.productId = '';
      this.editDisabled = false;
      this.modalRef.hide();
      this.resetData();
      this.notificationsService.infoNotification(`${newProduct.name} was successfully edited`);
    }
    else {
      //Перевірка на унікальність назви продукту
      if (this.products
        .filter(product => product.category === this.productCategory)
        .some(product => product.name === this.productName)) {
        this.notificationsService.warningNotification(`This product already exists: ${this.productName}`);
      }
      else {
        this.service.setData(newProduct);
        this.notificationsService.successNotification(`${newProduct.name} successfully added`)
        this.modalRef.hide();
        this.resetData();
      };
    };
  };

  cancelData(): void {
    this.modalRef.hide();
    this.resetData();
  };

  filterCategory(): void {
    this.productSize = null;
    this.productWeight = null;
  };
  resetData(): void {
    this.productCategory = '';
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productSize = null;
    this.productWeight = null;
    this.uploadProgress = null;
    this.productImage = '';
    this.addProductCheck = false;
  };

  editData(product, template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
    this.productId = product.id;
    this.productName = product.name;
    this.productCategory = product.category;
    this.productDescription = product.description;
    this.productPrice = product.price;
    this.productSize = product.size;
    this.productWeight = product.weight;
    this.productImage = product.image;
    this.addProductCheck = true;
    this.editProductImgBoolean = true;
    this.editSrc = product.image;
    this.editDisabled = true;
  };

  deleteData(product: IProduct, template: TemplateRef<any>): void {
    this.deleteProduct = product;
    this.modalRef = this.modalService.show(template);
  };

  confirmDeleteProduct(): void {
    this.service.deleteData(this.deleteProduct);
    this.modalRef.hide();
    this.notificationsService.successNotification(`${this.deleteProduct.name} successfully deleted`)
    this.searchProduct = '';
  };

  decline(): void {
    this.modalRef.hide();
  };

  cancelDeleteProduct(): void {
    this.modalRefWarning.hide();
  };

  selectCategory(name) {
    this.searchCategory = name || this.route.snapshot.paramMap.get('category');
    this.selected = name || this.route.snapshot.paramMap.get('category');
  };

}
