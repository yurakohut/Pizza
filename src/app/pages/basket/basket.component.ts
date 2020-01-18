import { Component, OnInit, TemplateRef } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { OrderService } from 'src/app/shared/services/order.service';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { Order } from 'src/app/shared/classes/order.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class BasketComponent implements OnInit {
  faTimes = faTimes;
  localProducts: Array<IProduct> = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  orderSum: number;
  orderCheck: boolean;
  modalRef: BsModalRef;
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  mask = ['+', '3', '8', '(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  constructor(private productService: ProductService, private _formBuilder: FormBuilder, private orderService: OrderService, private localStorageService: LocalStorageService, public dialog: MatDialog, private modalService: BsModalService, private notificationsService: NotificationService, private route: Router) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: '0'
    });
    this.localProducts = this.localStorageService.getDataLocalStorage('Products');
    this.checkBasketArray();
  };

  checkBasketArray(): void {
    if (this.localProducts.length > 0) {
      this.orderCheck = false;
      this.reduce();
    }
    else {
      this.orderCheck = true;
    }
  };

  //Сума замовлення
  reduce(): void {
    this.orderSum = (this.localProducts as Array<IProduct>).reduce((accumulator, value) => accumulator + value.price * value.count, 0)
  };

  countProductsInc(product): void {
    product.count++;
    this.changeCountInLocalStorage(product);
    this.reduce();
  };

  countProductsDec(product): void {
    if (product.count > 1) {
      product.count--;
      this.changeCountInLocalStorage(product);
      this.reduce();
    }
  };

  changeCountInLocalStorage(chosenProduct): void {
    const localStorageArray: Array<IProduct> = this.localStorageService.getDataLocalStorage('Products');
    const index = localStorageArray.findIndex(elem => elem.id === chosenProduct.id);
    localStorageArray.splice(index, 1, chosenProduct);
    this.localStorageService.setProductLocalStorage(localStorageArray);
  };

  checkCountProduct(event, product): void {
    const regExp = /^[1-9]{1}([0-9]{1})?([0-9]{1})?$/;
    const check = regExp.test(event.target.value);
    if (check) {
      product.count = Number(event.target.value);
    }
    else {
      event.target.value = 1;
      product.count = Number(event.target.value);
    }
    this.changeCountInLocalStorage(product);
    this.reduce();
  };

  deletePoduct(product: IProduct): void {
    const products = this.localStorageService.getDataLocalStorage('Products');
    const index = products.findIndex(findProduct => findProduct.id === product.id);
    this.localProducts.splice(index, 1);
    products.splice(index, 1);
    this.localStorageService.setProductLocalStorage(products);
    this.checkBasketArray();
    this.notificationsService.successNotification(`${product.name} successfully canceled`);
  };

  setOrder(): void {
    const newOrder: IOrder = new Order(this.userName.value, this.userAdress.value, this.userNumber.value, new Date(), this.localProducts, true);
    this.orderService.setData(newOrder);
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.localProducts = [];
    this.localStorageService.setProductLocalStorage(this.localProducts);
    this.checkBasketArray();
    window.scroll(0, 0);
    this.notificationsService.successNotification(`Order accepted!`);
  };

  closeWindow(): void {
    this.modalRef.hide();
  };
  get userName(): AbstractControl {
    return this.firstFormGroup.get('firstCtrl');
  };
  get userAdress(): AbstractControl {
    return this.secondFormGroup.get('secondCtrl');
  };
  get userNumber(): AbstractControl {
    return this.thirdFormGroup.get('thirdCtrl');
  };

}
