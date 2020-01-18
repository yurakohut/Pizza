import { IBlackList } from './blacklist.interface';

export interface IUser {
    username: string;
    email: string;
    password: string;
    blacklist: IBlackList;
    id?: string;
}