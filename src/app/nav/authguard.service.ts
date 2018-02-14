import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { ToastrService } from '../common/mw.common.module';

@Injectable()
export class AuthguardService implements CanActivate {

  @select(['user', 'currentUser']) currentUser$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUser$.map(currentUser => {
      if (currentUser) {
        return true;
      };

      const prompt = route.data['toastrPrompt'] || '';
      this.toastr.info( `Please log in ${prompt ? 'to access ' : ''} ${prompt}`, 'Authorisation required');

      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    });
  }
}
