import {Injectable, Optional, Inject} from '@angular/core';

@Injectable()
export class Logger {
  constructor(private prefix: string, private style: string) {}
  log(message: string) {
    console.log(`%c${this.prefix} | ${message}`, this.style);
  }
  error(message: string) {
    this.style += ' color: red;';
    console.log(`%c${this.prefix} | ${message}`, this.style);
  }
}
