import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Ideas } from '../models/ideas';
import { IdeaService } from '../services/idea.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-vote-count',
  templateUrl: './vote-count.component.html',
  styleUrls: ['./vote-count.component.scss']
})
export class VoteCountComponent implements OnInit {
  @Input() idea: Ideas;
  newVote: number = 0;
  constructor( private ideaService: IdeaService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  upvote(id: string) {
    this.idea.upvotes += 1;
    this.ideaService.upvoteIdea(id, this.idea)
    .pipe(first())
    .subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        this.notificationService.error(error, {autoClose: true});
      }
    );

  }

}
