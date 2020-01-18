import { IProduct } from './product.interface';

export interface IOrder {
    name: string;
    adress: string;
    number: string;
    date: Date,
    product: Array<IProduct>;
    isNew: boolean;
    id?: string;

}