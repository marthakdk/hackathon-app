import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../services/notification.service';
import { Notification, NotificationType } from '../models/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  notifications: Notification[] = [];
  notificationSubscription: Subscription;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationSubscription = this.notificationService
      .onNotify(this.id)
      .subscribe((notification) => {
        if (!notification.message) {
          return;
        }

        this.notifications.push(notification);

        if (notification.autoClose) {
          setTimeout(() => this.removeNotification(notification), 3000);
        }
      });
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }

  removeNotification(notification: Notification) {
    if (!this.notifications.includes(notification)) return;

    if (this.fade) {
      this.notifications.find((x) => x === notification).fade = true;
      setTimeout(() => {
        this.notifications = this.notifications.filter((x) => x !== notification);
      }, 250);
    } else {
      this.notifications = this.notifications.filter((x) => x !== notification);
    }
  }

  cssClass(notif: Notification) {
    if (!notif) return;

    const classes = ['alert', 'alert-dismissable', 'mt-4', 'container'];

    const notificationTypeClass = {
      [NotificationType.Success]: 'alert alert-success',
      [NotificationType.Error]: 'alert alert-danger',
      [NotificationType.Info]: 'alert alert-info',
      [NotificationType.Warning]: 'alert alert-warning',
    };

    classes.push(notificationTypeClass[notif.type]);

    if (notif.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}
