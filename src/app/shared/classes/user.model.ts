import { IUser } from '../interfaces/user.interface';
import { IBlackList } from '../interfaces/blacklist.interface';

export class User implements IUser {
    constructor(
        public username: string,
        public email: string,
        public password: string,
        public blacklist: IBlackList,
        public id?: string) { }
}

