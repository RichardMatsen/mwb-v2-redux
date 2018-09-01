import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { select } from 'app/store/store.service';
import { ToastrService } from 'app/common/toastr/toastr.service';
import { IUser } from '../model/user.model';
import { StoreService } from 'app/store/store.service';
import { waitforFirstNotNull, ifNull } from 'app/store/selector-helpers/selector-helpers';
import { UnsubscribeOnDestroy } from 'app/store/selector-helpers/unsubscribe-on-destroy';
import 'app/store/selector-helpers/subscribe-until-dead';

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

  public profileFormGroup: FormGroup;
  public firstName: FormControl;
  public lastName: FormControl;
  public password: FormControl;
  private sub: Subscription;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private store: StoreService
  ) {}

  ngOnInit() {
    waitforFirstNotNull(this.currentUser$, (currentUser) => {
      this.firstName = new FormControl(currentUser.firstName, [ Validators.required, Validators.pattern('[a-zA-Z].*') ]);
      this.lastName = new FormControl(currentUser.lastName, Validators.required);
      this.password = new FormControl(currentUser.password, Validators.required);
      this.profileFormGroup = new FormGroup({
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      });
    });
  }

  validateFirstName() {
    return this.firstName.valid || this.firstName.untouched;
  }

  validateLastName() {
    return this.lastName.valid || this.lastName.untouched;
  }

  validatePassword() {
    return this.password.valid || this.password.untouched;
  }

  saveProfile(formValues) {
    if (this.profileFormGroup.valid) {
      this.store.actions.userActions.updateCurrentUser(formValues.firstName, formValues.lastName);
      this.toastr.success('Profile saved');
      this.router.navigate(['/dashboard']);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.store.actions.userActions.setCurrentUser(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
  }
}
