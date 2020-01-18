import { Component, OnInit } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { ArchiveService } from 'src/app/shared/services/archive.service';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}
@Component({
  selector: 'app-admin-archive',
  templateUrl: './admin-archive.component.html',
  styleUrls: ['./admin-archive.component.css']
})
export class AdminArchiveComponent implements OnInit {
  archiveOrders: Array<IOrder> = [];
  search: string;
  constructor(private archiveService: ArchiveService) { }

  ngOnInit() {
    this.archiveService.getData().subscribe(actionArray => {
      this.archiveOrders = actionArray.map(order => {
        return {
          id: order.payload.doc.id,
          ...order.payload.doc.data()
        };
      });
    });
  }

  // Сортування замовлень - нові відображаються зверху
  sortArray(a, b): any {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };
  //Загальна сума замовлення клієнта
  orderSum(product): number {
    return product.reduce((accumulator, value) => accumulator + value.price * value.count, 0);
  };
  //Очищення всього архіву
  deleteAllArchive(): void {
    this.archiveService.deleteArray(this.archiveOrders)
  };

}
