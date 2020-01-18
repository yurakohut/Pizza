import { IProduct } from '../interfaces/product.interface';

export class Product implements IProduct {
    constructor(
        public category: string,
        public name: string,
        public description: string,
        public price: number,
        public count: number,
        public image?: string,
        public size?: number,
        public weight?: number,
        public id?: string,
    ) { }

}