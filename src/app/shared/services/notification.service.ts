import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notificationsService: NotificationsService) { }

  successNotification(message): void {
    this.notificationsService.success(message);
  };

  warningNotification(message): void {
    this.notificationsService.warn(message);
  };

  errorNotification(message): void {
    this.notificationsService.error(message);
  };
  
  infoNotification(message): void {
    this.notificationsService.info(message);
  };
}
