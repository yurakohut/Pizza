import { IGuest } from '../interfaces/guest.interface';

export class Guest implements IGuest {
    constructor(
        public name: string,
        public photo: string,
        public quote?: string,
        public details?: string,
        public id?: string,

    ) { }
}