import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Notification, NotificationType } from '../models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private subject = new Subject<Notification>();
    private defaultId = 'default-alert';

    onNotify(id = this.defaultId): Observable<Notification> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    success(message: string, options?: any) {
        this.notify(new Notification({ ...options, type: NotificationType.Success, message }));
    }

    error(message: string, options?: any) {
        this.notify(new Notification({ ...options, type: NotificationType.Error, message }));
    }

    info(message: string, options?: any) {
        this.notify(new Notification({ ...options, type: NotificationType.Info, message }));
    }

    warn(message: string, options?: any) {
        this.notify(new Notification({ ...options, type: NotificationType.Warning, message }));
    }
 
    notify(alert: Notification) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    clear(id = this.defaultId) {
        this.subject.next(new Notification({ id }));
    }
}
