import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';

export class Order implements IOrder {
    constructor(
        public name: string,
        public adress: string,
        public number: string,
        public date: Date,
        public product: Array<IProduct>,
        public isNew: boolean,
        public id?: string,
    ) { }
}