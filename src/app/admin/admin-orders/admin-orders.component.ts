import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { faTimes, faEdit, faUserEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { ArchiveService } from 'src/app/shared/services/archive.service';
import { Order } from 'src/app/shared/classes/order.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}
@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]
})

export class AdminOrdersComponent implements OnInit {
  orders: Array<IOrder> = [];
  categories: Array<ICategory> = [];
  products: Array<IProduct> = [];
  filterProducts: Array<IProduct> = [];
  modalRef: BsModalRef;
  faTimes = faTimes;
  faEdit = faEdit;
  faUserEdit = faUserEdit;
  faCheck = faCheck;
  changeProduct: IProduct;
  changeOrder: IOrder;
  regForm: any = {
    name: '',
    adress: '',
  }
  productCategory: string;
  productName: string;
  productCount: number;
  editOrder: IOrder;
  editId: string;
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private orderService: OrderService, private productService: ProductService, private categoryService: CategoryService, private firestore: AngularFirestore, public dialog: MatDialog, private modalService: BsModalService, private archiveService: ArchiveService, private notificationsService: NotificationService) { }

  ngOnInit() {
    this.orderService.getData().subscribe(actionArray => {
      this.orders = actionArray.map(order => {
        return {
          id: order.payload.doc.id,
          ...order.payload.doc.data()
        };
      });
    });
    //Наявні категорії продуктів. Потрібно при додаванні нового продукту до замовлення
    this.categoryService.getData().subscribe(actionArray => {
      this.categories = actionArray.map(category => {
        return {
          id: category.payload.doc.id,
          ...category.payload.doc.data()
        };
      });
    });
    //Наявні продукти. Потрібно для додавання нового продукту до замолення
    this.productService.getData().subscribe(actionArray => {
      this.products = actionArray.map(product => {
        return {
          id: product.payload.doc.id,
          ...product.payload.doc.data()
        };
      });
    });
  };

  //Після зміни даних блок  не перерендується. Застосований до головного циклу в HTML
  trackByPackId = (index, pack) => pack.id;

  editUserModal(template: TemplateRef<any>, order: IOrder): void {
    this.modalRef = this.modalService.show(template);
    this.regForm.name = order.name;
    this.regForm.adress = order.adress;
    this.editOrder = order;
    this.editId = order.id;
  };
  cancelOrderModal(template: TemplateRef<any>, order: IOrder, product?: IProduct): void {
    this.modalRef = this.modalService.show(template);
    this.changeProduct = product;
    this.changeOrder = order;
    this.editId = order.id;
  };

  confirmDeleteOrder(): void {
    this.orderService.deleteData(this.changeOrder);
    this.modalRef.hide();
    this.notificationsService.successNotification(`Order successfully canceled`);

  };
  //Шукаю індекс продукту в замовленні по ID і видаляю його із замовлення
  confirmDeleteProduct(): void {
    const index = this.changeOrder.product.findIndex(findProd => findProd.id === this.changeProduct.id);
    this.changeOrder.product.splice(index, 1);
    const newOrder: IOrder = new Order(this.changeOrder.name, this.changeOrder.adress, this.changeOrder.number, this.changeOrder.date, this.changeOrder.product, false);
    this.orderService.updateData(newOrder, this.editId);
    this.editId = '';
    this.modalRef.hide();
    this.notificationsService.successNotification(`Product successfully deleted`);

  };
  addProductModal(template: TemplateRef<any>, order: IOrder): void {
    this.modalRef = this.modalService.show(template);
    this.editOrder = order;
    this.editId = order.id;
  };

  decline(): void {
    this.modalRef.hide();
  };

  //Загальна сума замовлення клієнта
  orderSum(product): number {
    return product.reduce((accumulator, value) => accumulator + value.price * value.count, 0);
  };

  // Редагування адреси і імені користувача
  updateUserData(): void {
    const newOrder: IOrder = new Order(this.regForm.name, this.regForm.adress, this.editOrder.number, this.editOrder.date, this.editOrder.product, false);
    this.orderService.updateData(newOrder, this.editId);
    this.editId = '';
    this.modalRef.hide();
    this.notificationsService.successNotification(`User successfully edited`);
  };

  //При додаванні адміном нового продукту, фільтрація за категорією
  filterCategory(): void {
    this.filterProducts = this.products.filter(val => val.category === this.productCategory.trim());
    this.productName = '';
    this.productCount = null;
  };

  //Добавлення нового продукту в замовлення
  addProduct(): void {
    const product = this.filterProducts.filter(val => val.name === this.productName)[0];
    product.count = Number(this.productCount);
    //Якщо такий продукт вже є, то міняю його count
    if (this.editOrder.product.find(allProducts => allProducts.id === product.id)) {
      const index = this.editOrder.product.findIndex(elements => elements.id === product.id);
      this.editOrder.product[index].count += product.count;
      this.notificationsService.infoNotification(`Product quantity successfully changed`);

    }
    //Якщо такого продукту ще немає
    else {
      this.editOrder.product.push(product);
      this.notificationsService.infoNotification(`Product successfully added`);
    };
    const newOrder: IOrder = new Order(this.editOrder.name, this.editOrder.adress, this.editOrder.number, this.editOrder.date, this.editOrder.product, false)
    this.orderService.updateData(newOrder, this.editId);
    this.editId = '';
    this.productCategory = '';
    this.productName = '';
    this.productCount = null;
    this.modalRef.hide();
  };

  // Змінюється стан продукту, якщо він новий
  changeOrderState(order: IOrder): void {
    if (order.isNew) {
      const newOrder: IOrder = new Order(order.name, order.adress, order.number, order.date, order.product, false)
      this.editId = order.id;
      this.orderService.updateData(newOrder, this.editId);
      this.editId = '';
    }
  };
  deliveredOrder(order: IOrder): void {
    this.orderService.deleteData(order);
    delete order.id;
    this.archiveService.setData(order);
    this.notificationsService.infoNotification(`Order successfully sent to archive`);
  }
  // Сортування замовлень - нові відображаються зверху
  sortArray(a, b): any {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };
}
