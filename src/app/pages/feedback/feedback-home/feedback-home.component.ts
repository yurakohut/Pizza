import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { faSignOutAlt, faPlus, faPen, faClock, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { PostService } from 'src/app/shared/services/post.service';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { Post } from 'src/app/shared/classes/post.model';
import { PaginatorService } from 'src/app/shared/services/paginator.service';

@Component({
  selector: 'app-feedback-home',
  templateUrl: './feedback-home.component.html',
  styleUrls: ['./feedback-home.component.css']
})
export class FeedbackHomeComponent implements OnInit {

  faSignOutAlt = faSignOutAlt;
  faPlus = faPlus;
  faPen = faPen;
  faClock = faClock;
  faExclamationCircle = faExclamationCircle;
  posts: Array<IPost> = [];
  userName: string;
  modalRef: BsModalRef;
  userPostText: string;
  users: Array<IUser> = [];
  page: number = 1;
  checkPaginator: boolean;
  chosenPost: IPost;
  postId: string;
  postButtonName: string = 'Add'
  possibilityToCreate: boolean = true;
  reasonForBlock: string = '';
  constructor(private localStorageService: LocalStorageService, private route: Router, private paginatorService: PaginatorService, private userService: UserService, private postService: PostService, public dialog: MatDialog, private modalService: BsModalService) { }

  ngOnInit() {
    this.postService.getData().subscribe(actionArray => {
      this.posts = actionArray.map(post => {
        return {
          id: post.payload.doc.id,
          ...post.payload.doc.data()
        };
      });
      this.posts.length > 30 ? this.checkPaginator = true : this.checkPaginator = false;
    });
    this.userService.getData().subscribe(actionArray => {
      this.users = actionArray.map(user => {
        return {
          id: user.payload.doc.id,
          ...user.payload.doc.data()
        };
      });
      this.checkAuthorization();
    });
  };

  //Після зміни даних блок  не перерендується. Застосований до головного циклу в HTML
  trackByPackId = (index, pack) => pack.id;


  checkAuthorization(): void {
    const checkUser = this.localStorageService.getDataLocalStorage('User')
    if (checkUser.length === 0) {
      this.route.navigate(['feedback/authorization']);
    }
    else {
      this.userName = checkUser[0];
      const check = this.users.find(user => user.username === this.userName);
      //якщо користувач в чорному списку, зникає можливість створювати нові повідомлення
      check.blacklist.isBlackList ? this.possibilityToCreate = false : this.possibilityToCreate = true;
      this.reasonForBlock = check.blacklist.reason || 'not specified';
    }
  };

  logOut(): void {
    localStorage.removeItem('User');
    this.checkAuthorization();
  };

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
    this.postButtonName = 'Add';
  };

  deletePost(template: TemplateRef<any>, post: IPost): void {
    this.modalRef = this.modalService.show(template);
    this.chosenPost = post;
  };

  confirmDeletePost(): void {
    this.postService.deleteData(this.chosenPost);
    this.modalRef.hide();
  };

  decline(): void {
    this.modalRef.hide();
  };

  addPost(): void {
    const user = this.users.filter(user => user.username === this.userName)[0];
    const newPost: IPost = new Post(this.userPostText, user, new Date());
    //Спрацьовує, коли редагується пост, оскільки при редагування даю посту ID
    if (this.postId) {
      this.postService.updateData(newPost, this.postId);
      this.postId = '';
    }
    else {
      this.postService.setData(newPost);
    };
    this.modalRef.hide();
    this.userPostText = '';
  };
  
  editPost(template: TemplateRef<any>, post: IPost): void {
    this.postButtonName = 'Save edit';
    this.modalRef = this.modalService.show(template);
    this.userPostText = post.text;
    this.postId = post.id
  };

  //Сортування постів за датою
  sortArray(a, b): any {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  };
}
