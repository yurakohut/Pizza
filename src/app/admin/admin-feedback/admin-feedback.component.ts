import { Component, OnInit, TemplateRef } from '@angular/core';
import { IPost } from 'src/app/shared/interfaces/post.interface';
import { PostService } from 'src/app/shared/services/post.service';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { User } from 'src/app/shared/classes/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { BlacklistService } from 'src/app/shared/services/blacklist.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}
@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.css']
})
export class AdminFeedbackComponent implements OnInit {
  posts: Array<IPost> = [];
  modalRef: BsModalRef;
  userReasonBlock: string = '';
  chosenUser: IUser;
  search: string;
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private postService: PostService, public dialog: MatDialog, private modalService: BsModalService, private userService: UserService, private blackListService: BlacklistService, private notificationsService: NotificationService) { }

  ngOnInit() {
    this.postService.getData().subscribe(actionArray => {
      this.posts = actionArray.map(post => {
        return {
          id: post.payload.doc.id,
          ...post.payload.doc.data()
        };
      });
    });
  }
  // Сортування постів - нові відображаються зверху
  sortArray(a, b): any {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };

  //Після зміни даних блок не перерендується. Застосований до головного циклу в HTML
  trackByPackId = (index, pack) => pack.id;

  blockModalUser(template: TemplateRef<any>, user: IUser): void {
    this.modalRef = this.modalService.show(template);
    this.chosenUser = user;
  };

  //Змінюю статус юзеру і кидаю в blackListService
  confirmBlockUser(): void {
    const blockedUser: IUser = new User(this.chosenUser.username, this.chosenUser.email, this.chosenUser.password, { isBlackList: true, reason: this.userReasonBlock });
    const userPosts: Array<IPost> = this.posts.filter(posts => posts.writtenBy.username === blockedUser.username);
    this.userService.updateData(blockedUser, this.chosenUser.id, userPosts);
    this.blackListService.setData(blockedUser);
    this.closeWindow();
    this.notificationsService.successNotification(`${blockedUser.username} got blacklisted`)
  };

  closeWindow(): void {
    this.modalRef.hide();
    this.userReasonBlock = '';
  };
}
