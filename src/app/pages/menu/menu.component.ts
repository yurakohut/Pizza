import { Component, OnInit, TemplateRef } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/classes/product.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { MatDialog } from '@angular/material/dialog';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],

})

export class MenuComponent implements OnInit {
  categories: Array<ICategory> = [];
  categoryName: string;
  products: Array<IProduct> = [];
  filterProducts: Array<IProduct> = [];
  filterCategoryName: string = 'pizza';
  countProductsNumber: number = 1;
  page: number = 1;
  checkPaginator: boolean = false;
  selected: string;
  productPerPage: number = 9;
  modalRef: BsModalRef;
  isActiveCheckBox: boolean = false;
  isActiveModal: boolean;
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private categoryService: CategoryService, private productService: ProductService,
    private route: ActivatedRoute, private localStorageService: LocalStorageService, private paginatorService: PaginatorService, private routeLink: Router, public dialog: MatDialog, private modalService: BsModalService, private notificationsService: NotificationService) { }
  ngOnInit() {
    this.categoryService.getData().subscribe(actionArray => {
      this.categories = actionArray.map(category => {
        return {
          id: category.payload.doc.id,
          ...category.payload.doc.data()
        };
      });
    });
    this.productService.getData().subscribe(actionArray => {
      this.products = actionArray.map(product => {
        return {
          id: product.payload.doc.id,
          ...product.payload.doc.data()
        };
      });
      this.selectCategory('');
      this.paginatorService.currentPage.subscribe(page => this.page = page);
      this.isActiveModal = this.checkWindowShow();
    });
  }
  //Роблю кнопку активною при кліку
  isActive(item) {
    return this.selected === item;
  };

  selectCategory(name) {
    this.categoryName = name || this.route.snapshot.paramMap.get('category');
    this.filterCategory(this.categoryName);
    this.selected = name || this.route.snapshot.paramMap.get('category');
  };

  filterCategory(name) {
    this.filterCategoryName = name;
    this.filterProducts = this.products.filter(val => val.category === this.filterCategoryName.trim());
    this.filterProducts.length > this.productPerPage ? this.checkPaginator = true : this.checkPaginator = false;
  };

  countProductsInc(product): void {
    product.count++;
  };

  countProductsDec(product): void {
    if (product.count > 1) {
      product.count--;
    }
  };

  //Перевірка введення користувачем кількості продукту
  checkCountProduct(event, product): void {
    const regExp = /^[1-9]{1}([0-9]{1})?([0-9]{1})?$/
    const check = regExp.test(event.target.value)
    if (check) {
      product.count = Number(event.target.value);
    }
    else {
      event.target.value = 1;
      product.count = Number(event.target.value);
    }
  };

  orderInLocalST(product: IProduct, template: TemplateRef<any>): void {
    const newOrder = new Product(product.category, product.name, product.description, product.price, product.count, product.image, product.size, product.weight, product.id)
    this.localStorageService.addProductLocalStorage(newOrder);
    //Якщо користувач хоче/не хоче бачити мадолку про добавлення товару в кошик
    if (!this.isActiveModal) {
      this.modalRef = this.modalService.show(template);
    }
    else {
      this.notificationsService.successNotification('Product successfully ordered')
    }
  };

  scrollUp(): void {
    window.scroll(0, 0);
  };

  closeWindow(): void {
    this.modalRef.hide();
    if (this.isActiveCheckBox && !this.checkWindowShow()) {
      localStorage.setItem('ModalWindowHide', JSON.stringify([this.isActiveCheckBox]));
      this.isActiveModal = this.checkWindowShow();
    }
  };
  
  checkWindowShow(): boolean {
    return this.localStorageService.getDataLocalStorage('ModalWindowHide').length > 0 ? true : false;
  };
}
