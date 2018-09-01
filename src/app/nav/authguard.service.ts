import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ToastrService } from '../common/mw.common.module';
import { LocalStorageService } from 'angular-2-local-storage';

import { select } from 'app/store/store.service';
import { AuthService } from '../user/auth.service';

@Injectable()
export class AuthguardService implements CanActivate {

  @select(['user', 'currentUser']) currentUser$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUser$.map(currentUser => {

      if (currentUser) {
        return true;
      }

      if (this.authService.checkLocalStorage()) {
        return true;
      }

      const prompt = route.data['toastrPrompt'] || '';
      this.toastr.info( `Please log in ${prompt ? 'to access ' : ''} ${prompt}`, 'Authorisation required');

      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    });
  }
}
