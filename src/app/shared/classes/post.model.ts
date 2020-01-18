import { IPost } from '../interfaces/post.interface';
import { IUser } from '../interfaces/user.interface';

export class Post implements IPost {
    constructor(
        public text: string,
        public writtenBy: IUser,
        public date: Date,
        public id?: string
    ) { }
}