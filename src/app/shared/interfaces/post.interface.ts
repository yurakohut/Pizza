import { IUser } from './user.interface';

export interface IPost {
    text: string;
    writtenBy: IUser;
    date: Date;
    id?: string;
}