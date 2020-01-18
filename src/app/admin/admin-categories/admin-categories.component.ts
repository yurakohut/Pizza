import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { Category } from 'src/app/shared/classes/category.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  categories: Array<ICategory> = [];
  categoryId: string;
  categoryName: string;
  modalRef: BsModalRef;
  deleteCategory: ICategory;
  categoryButtonAddCheck: boolean = false;
  allProducts: Array<IProduct> = [];
  deleteArrayProductsThisCategory: Array<IProduct> = [];
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private service: CategoryService, private productService: ProductService, private firestore: AngularFirestore, private modalService: BsModalService, private notificationsService: NotificationService) { }

  ngOnInit() {
    this.service.getData().subscribe(actionArray => {
      this.categories = actionArray.map(category => {
        return {
          id: category.payload.doc.id,
          ...category.payload.doc.data()
        };
      });
    });
    this.productService.getData().subscribe(actionArray => {
      this.allProducts = actionArray.map(product => {
        return {
          id: product.payload.doc.id,
          ...product.payload.doc.data()
        };
      });
    });
  }

  //Додавання нової категорії. Якщо така вже є - вискакує сповіщення.
  setData(): void {
    if (this.categories.find(searchCategory => searchCategory.name === this.categoryName)) {
      this.notificationsService.warningNotification(`This category already exists`)
    }
    else {
      const newCategory: ICategory = new Category(this.categoryName)
      this.service.setData(newCategory);
      this.categoryName = '';
      this.notificationsService.successNotification(`${this.categoryName} successfully added`)
    }
    this.categoryButtonAddCheck = false;
  };

  deleteData(category: ICategory, template: TemplateRef<any>): void {
    this.deleteCategory = category;
    this.modalRef = this.modalService.show(template);
    this.categoryName = '';
    this.deleteArrayProductsThisCategory = this.allProducts.filter(val => val.category === category.name)
  };

  //Видалення категорії та усіх товарів, які належать до неї
  confirmDeleteCategory(): void {
    this.service.deleteData(this.deleteCategory);
    if (this.deleteArrayProductsThisCategory.length > 0) {
      this.service.deleteArrayOfProducts(this.deleteArrayProductsThisCategory);
    }
    this.notificationsService.successNotification(`${this.deleteCategory.name} successfully deleted`)
    this.modalRef.hide();
  };

  decline(): void {
    this.modalRef.hide();
  };

  checkCategoryValue(event): void {
    const regExp = /^([a-zA-Z]{1,})([\s]{1})?([a-zA-Z]{1,})?$/;
    const check = regExp.test(event.target.value);
    if (!check) {
      event.target.value = '';
      this.categoryButtonAddCheck = false;
    }
    else {
      this.categoryButtonAddCheck = true;
    }
  };
}
