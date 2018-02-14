import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <div>
    <router-outlet></router-outlet>
  </div>
  `
})
export class DummyAppComponent {}
