import { Component, OnInit, TemplateRef } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { BlacklistService } from 'src/app/shared/services/blacklist.service';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-admin-blacklist',
  templateUrl: './admin-blacklist.component.html',
  styleUrls: ['./admin-blacklist.component.css']
})
export class AdminBlacklistComponent implements OnInit {
  blockedUsers: Array<IUser> = [];
  modalRef: BsModalRef;
  editId: string;
  allUsers: Array<IUser> = [];
  unblockUser: IUser;
  blackListUser: IUser;
  search: string;
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private blacklistService: BlacklistService, private userService: UserService, public dialog: MatDialog, private modalService: BsModalService, private notificationsService: NotificationService) { }
  ngOnInit() {
    this.blacklistService.getData().subscribe(actionArray => {
      this.blockedUsers = actionArray.map(post => {
        return {
          id: post.payload.doc.id,
          ...post.payload.doc.data()
        };
      });
    });
    this.userService.getData().subscribe(actionArray => {
      this.allUsers = actionArray.map(user => {
        return {
          id: user.payload.doc.id,
          ...user.payload.doc.data()
        };
      });
    });
  }

  //Після зміни даних блок  не перерендується. Застосований до головного циклу в HTML
  trackByPackId = (index, pack) => pack.id;

  unblockModalUser(template: TemplateRef<any>, user: IUser): void {
    this.modalRef = this.modalService.show(template);
    this.blackListUser = user;
    this.unblockUser = this.allUsers.find(chsnUser => chsnUser.username === user.username);
  };

  confirmUnblockUser(): void {
    this.blacklistService.deleteData(this.blackListUser)
    this.editId = this.unblockUser.id;
    this.unblockUser.blacklist.isBlackList = false;
    delete this.unblockUser.blacklist.reason;
    this.userService.updateData(this.unblockUser, this.editId);
    this.modalRef.hide();
    this.notificationsService.successNotification(`${this.unblockUser.username} successfully unblocked`)
  };

  closeWindow(): void {
    this.modalRef.hide();
  };
  
}


