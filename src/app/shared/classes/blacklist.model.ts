import { IBlackList } from '../interfaces/blacklist.interface';

export class BlackList implements IBlackList {
    constructor(
        public isBlackList: boolean,
        public reason?: string
    ) { }
}