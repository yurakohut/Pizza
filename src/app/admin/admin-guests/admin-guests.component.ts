import { Component, OnInit, TemplateRef } from '@angular/core';
import { IGuest } from 'src/app/shared/interfaces/guest.interface';
import { GuestService } from 'src/app/shared/services/guest.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { Guest } from 'src/app/shared/classes/guest.model';
import { Type } from 'src/app/shared/classes/type.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-admin-guests',
  templateUrl: './admin-guests.component.html',
  styleUrls: ['./admin-guests.component.css']
})
export class AdminGuestsComponent implements OnInit {

  guests: Array<IGuest> = [];
  modalRef: BsModalRef;
  guestPhoto: string;
  guestInfo: string = '';
  guestName: string;
  guestQuote: string = '';
  guestId: string;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  urlImage: string;
  progress: boolean = false;

  modalCheck: boolean;
  deleteGuest: IGuest;
  addGuestPhotoCheck: boolean;
  anotherType: string;
  showButtonType: string;
  mainType: IType;
  public options = {
    position: ["right", "top"],
    timeOut: 2000,
    lastOnBottom: true,
    clickToClose: true
  }
  constructor(private service: GuestService, private firestore: AngularFirestore, private prStorage: AngularFireStorage, private modalService: BsModalService, private notificationsService: NotificationService) { }

  ngOnInit() {
    this.service.getData().subscribe(actionArray => {
      this.guests = actionArray.map(guests => {
        return {
          id: guests.payload.doc.id,
          ...guests.payload.doc.data()
        };
      });
    });
    this.service.getType().subscribe(actionArray => {
      this.mainType = actionArray.map(type => {
        return {
          id: type.payload.doc.id,
          ...type.payload.doc.data()
        };
      });
      this.showButtonType = this.mainType[0].name;
    });
  }

  openGuestModal(template: TemplateRef<any>): void {
    this.resetData();
    this.modalRef = this.modalService.show(template);
  };

  // Завантаження картинки
  public upload(event): void {
    const id = Math.random().toString(36).substring(2);
    this.progress = true;
    this.ref = this.prStorage.ref(`images/${id}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe(url => this.guestPhoto = url);
        this.progress = false;
        this.addGuestPhotoCheck = true;
      })
    ).subscribe();
  };

  setData(): void {
    const newGuest: IGuest = new Guest(this.guestName, this.guestPhoto, this.guestQuote, this.guestInfo);
    this.service.setData(newGuest);
    this.notificationsService.successNotification(`${newGuest.name} successfully added`);
    this.resetData();
    this.modalRef.hide();
  };
  resetData(): void {
    this.guestName = '';
    this.guestPhoto = '';
    this.guestQuote = '';
    this.guestInfo = '';
    this.uploadProgress = null;
    this.guestPhoto = '';
    this.addGuestPhotoCheck = false;
  };
  deleteData(guest: IGuest, template: TemplateRef<any>): void {
    this.deleteGuest = guest;
    this.modalRef = this.modalService.show(template);
  };
  confirmDeleteGuest(): void {
    this.service.deleteData(this.deleteGuest);
    this.modalRef.hide();
    this.notificationsService.successNotification(`Guest successfully deleted`);
  };
  decline(): void {
    this.modalRef.hide();
  };
  cancelData(): void {
    this.modalRef.hide();
    this.resetData();
  };

  //Встановлення типу, який відображається на головній сторінці
  setType(): void {
    const newType: IType = new Type(this.anotherType);
    this.service.updateType(newType, this.mainType[0].id);
    this.showButtonType = this.anotherType;
    this.anotherType = '';
    this.notificationsService.successNotification(`Type successfully edited`);
  };
}
