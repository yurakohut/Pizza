import { Component, OnInit, TemplateRef } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { shake, flip, tada } from 'ng-animate';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/classes/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { IBlackList } from 'src/app/shared/interfaces/blacklist.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-feedback-authorization',
  templateUrl: './feedback-authorization.component.html',
  styleUrls: ['./feedback-authorization.component.css'],
  animations: [
    trigger('shake', [transition('start <=> end', useAnimation(shake)),
    ]),
    trigger('flip', [transition('start <=> end', useAnimation(flip)),
    ])
  ],
})
export class FeedbackAuthorizationComponent implements OnInit {
  form: FormGroup;
  users: Array<IUser> = [];
  signUpOrLogInCheck: boolean = true;
  title: string = 'Sign Up'
  userName: string;
  shake: any;
  flip: any;
  userPasswordState: string = 'start';
  flipState: string = 'start'
  userNameState: string = 'start';
  existingName: boolean;
  existingEmail: boolean;
  wrongData: boolean;
  blackList: IBlackList = { isBlackList: false };
  modalRef: BsModalRef;
  reasonForBlock: string;

  constructor(private userService: UserService, private route: Router, private localStorageService: LocalStorageService, public dialog: MatDialog, private modalService: BsModalService) { }
  ngOnInit() {
    window.scrollTo(0, 0)
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.userService.getData().subscribe(actionArray => {
      this.users = actionArray.map(user => {
        return {
          id: user.payload.doc.id,
          ...user.payload.doc.data()
        };
      });
    });
    this.checkAuthorization();
  };

  changeAnimationState(subject): string {
    return subject === 'end' ? 'start' : 'end';
  };
  
  //Перевірка логування / реєстрації
  checkLog(): void {
    this.flipState = this.changeAnimationState(this.flipState);
    this.signUpOrLogInCheck = !this.signUpOrLogInCheck;
    this.title = this.title === 'Sign Up' ? 'Log In' : 'Sign Up';
    this.existingName = false;
    this.existingEmail = false;
    this.form.reset();
  }

  signUp(): void {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      const newUser: IUser = new User(formData.username, formData.email, formData.password, this.blackList)
      console.log(newUser);
      this.existingName = this.users.some(user => user.username === newUser.username);
      this.existingEmail = this.users.some(user => user.email === newUser.email);
      //Якщо такого нікнейму і мейлу нема, то перекидає на іншу компоненту
      if (!this.existingName && !this.existingEmail) {
        this.userService.setData(newUser);
        this.localStorageService.setUserLocalStorage(newUser.username);
        this.form.reset();
        this.checkAuthorization();
      }
    }
  };

  checkAuthorization(): void {
    if (this.localStorageService.getDataLocalStorage('User').length > 0) {
      this.route.navigate(['feedback/home']);
    }
  };

  logIn(template: TemplateRef<any>): void {
    //Якщо форма пуста - відбувається shake-анімація
    !this.form.value.username ? this.userNameState = this.changeAnimationState(this.userNameState) : null;
    !this.form.value.password ? this.userPasswordState = this.changeAnimationState(this.userPasswordState) : null;
    const formData = { ...this.form.value };
    if (this.users.some(user => user.username === formData.username && user.password === formData.password)) {
      const searchUser = this.users.find(user => user.username === formData.username && user.password === formData.password);
      this.wrongData = false;
      //якщо користувач в чорному списку, показуэться модалка з причиною, якщо вона є
      if (searchUser.blacklist.isBlackList) {
        this.reasonForBlock = searchUser.blacklist.reason;
        this.modalRef = this.modalService.show(template);
      }
      this.localStorageService.setUserLocalStorage(searchUser.username);
      this.checkAuthorization();
      this.form.reset();
    }
    else {
      this.wrongData = true;
    }
  };

  closeWindow(): void {
    this.modalRef.hide();
  };
}
