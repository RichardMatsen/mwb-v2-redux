import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { take } from 'rxjs/operators';

import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/take'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  ngOnInit() {

    let things = new BehaviorSubject<any[]>(['thing-a']);
    things.filter((things) => things.length > 0).take(1).subscribe(console.log)
    things.asObservable().filter((things) => things.length > 0).take(1).subscribe(console.log)
    things.filter((things) => things.length > 0).pipe(take(1)).subscribe( ... )
  }
  
}
