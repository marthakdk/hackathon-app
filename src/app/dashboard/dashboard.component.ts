import { NotificationService } from '../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/users';
import { AuthenticationService } from '../services/authentication.service';
import { IdeaService } from '../services/idea.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User;
  form: FormGroup;
  ideas = [];
  addNew: boolean = false;
  preDefinedTags: string[] = [];
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private ideaService: IdeaService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.preDefinedTags = ['feature', 'tech'];
    this.loadAllIdeas();
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      ftag: ['', Validators.required],
    });
  }
  addNewIdea() {
    this.addNew = true;
  }

  createIdea() {}

  selectTag(tag: any) {
    this.form.controls.ftag.setValue(tag.target.value);
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    this.notificationService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const ideaParams = this.form.value;
    ideaParams.createdBy = this.currentUser.username;
    this.ideaService
      .createNewIdea(this.form.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.notificationService.success('Your idea has been added.', {
            keepAfterRouteChange: true,
          });
          this.loadAllIdeas();
          this.loading = !this.loading;
          this.addNew = !this.addNew;
          this.form.reset(this.form.value);
        },
        (error) => {
          this.notificationService.error(error, {autoClose: true});
          this.loading = false;
        }
      );
  }

  private loadAllIdeas() {
    this.ideaService
      .getAllIdeas()
      .pipe(first())
      .subscribe((ideas) => (this.ideas = ideas));
  }
}
