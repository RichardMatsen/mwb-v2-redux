import { Directive, AfterViewInit, AfterViewChecked, Host, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[scrollbarPaddingAdjust]',
})
export class ScrollbarPaddingAdjustDirective implements AfterViewInit, AfterViewChecked {

  private hostConfigOk;
  private wrapper;
  private list;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.getHostConfig();
  }

  getHostConfig() {
    this.wrapper = this.elementRef.nativeElement;
    this.list = this.wrapper.querySelector('ul');
    if (!this.list) {
      this.hostConfigOk = false;
      return;
    }
    const overflowY = this.list.ownerDocument.defaultView
      .getComputedStyle(this.list, undefined).overflowY;
    this.hostConfigOk = (overflowY === 'auto' || overflowY === 'scroll') && this.wrapper && this.list;
  }

  ngAfterViewChecked() {
    if (this.hostConfigOk) {
      this.calcListPaddingRight();
    }
  }

  calcListPaddingRight() {
    // Ref: https://github.com/milichev/ng2-if-scrollbars/blob/master/IfScrollbars.ts
    const scrollIsVisible = this.list.clientHeight < this.list.scrollHeight;
    this.wrapper.style.paddingRight = scrollIsVisible ? '0.2em' : '1em';
  }

}
