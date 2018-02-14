import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';

import { ToastrService } from '../common/toastr/toastr.service';
import { IUser } from '../model/user.model';
import { UserActions } from './user.actions';
import { waitforFirstNotNull, ifNull } from '../store/selector-helpers/selector-helpers';
import { UnsubscribeOnDestroy } from '../store/selector-helpers/unsubscribe-on-destroy';
declare var require
const x = require('../store/selector-helpers/subscribe-until-dead');

@Component({
  templateUrl: './profile.component.html',
  styles: [
    'em { float: right; color: #E05C65; padding-left: 10px; }',
    'mat-card-content { height: 300px }',
    '.error input { background-color: #E3C3C5; }',
    '.error ::-webkit-input-placeholder { color: #999; }',
    '.error :-moz-placeholder { color: #999; }',
    '.error ::-moz-placeholder { color: #999; }',
    '.error :ms-input-placeholder  { color: #999; }'
  ]
})
@UnsubscribeOnDestroy()
export class ProfileComponent implements OnInit, OnDestroy {

  @select(['user', 'currentUser']) currentUser$: Observable<IUser>;

  private profileFormGroup: FormGroup;
  private firstName: FormControl;
  private lastName: FormControl;
  private sub: Subscription;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userActions: UserActions,
  ) {}

  ngOnInit() {
    waitforFirstNotNull(this.currentUser$, (currentUser) => {
      this.firstName = new FormControl(currentUser.firstName, [ Validators.required, Validators.pattern('[a-zA-Z].*') ]);
      this.lastName = new FormControl(currentUser.lastName, Validators.required);
      this.profileFormGroup = new FormGroup({
        firstName: this.firstName,
        lastName: this.lastName
      });
    });
  }

  validateFirstName() {
    return this.firstName.valid || this.firstName.untouched;
  }

  validateLastName() {
    return this.lastName.valid || this.lastName.untouched;
  }

  saveProfile(formValues) {
    if (this.profileFormGroup.valid) {
      this.userActions.updateCurrentUser(formValues.firstName, formValues.lastName);
      this.toastr.success('Profile saved');
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
  }
}
