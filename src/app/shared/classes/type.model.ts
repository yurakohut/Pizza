import { IType } from '../interfaces/type.interface';

export class Type implements IType {
    constructor(
        public name: string,
        public id?: string

    ) { }
}
