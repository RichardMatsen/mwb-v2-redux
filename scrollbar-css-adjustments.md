
# Scrollbar CSS Adjustments

The file-list component is a wrapper for a listbox which encapsulates changes to the scroll bar, as follows:
- thinner scroll thumb, since horizontal space is at a premium
- no up/down arrows at top and bottom
- jump to scrollbar bottom when list elements increase 
- prevent list narrowing when vertical scrollbar appears

## **Styling for automatic scrolling to bottom of the list**

This is acheived by setting the **scrollTop** attribute via an expression.

```javascript
<ul #scrollingList [scrollTop]="scrollingList.scrollHeight">
  <li *ngFor="let item of visibleFiles">
  ...
  </li>
</ul>
```

## **Styling for thin scrollbar**

Use vendor-prefixes to change various attributes of the scrollbar. 

```css
::-webkit-scrollbar
{
  width: 0.6em;  /* for vertical scrollbars */
  height: 0.6em; /* for horizontal scrollbars */
  margin-right: -0.8em;
}

::-webkit-scrollbar-track
{
  background: #2175bc;
}

::-webkit-scrollbar-thumb
{
  background: #90bade;
}

ul {
  scrollbar-track-color: #2175bc;
  scrollbar-face-color: #90bade;
}


::-moz-scrollbar
{
  width: 0.6em;  /* for vertical scrollbars */
  height: 0.6em; /* for horizontal scrollbars */
}

::-moz-scrollbar-track
{
  background: #2175bc;
}

::-moz-scrollbar-thumb
{
  background: #90bade;
}

```

## **Auto scrollbar prevent list width change**

`overflow-y` is set to `auto`, so when the scrollbar appears the list redraws, as it's area is made narrower. To avoid the 'blink' on redraw, we maintain a constant list width by adjusting **padding-right** on the list.  

This needs to be done in javascript in order to detect the scrollbar appearance during Angular's change detection cycle.

### **ScrollbarPaddingAdjust directive**  
The code for this is wrapped in an attribute directive, which grabs a reference to it's host element and changes it's properties as appropriate.

**Host Referenece**  
The elements of the host component are accessed by injecting the host.  
```javascript
@Directive({ 
  selector: '[scrollbarPaddingAdjust]',
})
export class ScrollbarPaddingAdjust implements AfterViewInit, AfterViewChecked {
  constructor(private elementRef: ElementRef) {}
  ...
}
```

**Host configuration**  
The configuration required for this to work is checked in **ngAfterViewInit**.

```javascript
private hostConfigOk;
private wrapper;
private list;

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
```

**Changing padding-right**  
Padding-right is adjusted after each change detection.  

Note, because of Angular's checks for feedback loops in change detection, we set the css using **nativeElement**.  
If we used an Angular mechanism for setting padding-right (e.g `[ngStyle]"..."`), we would get the exception ***ExpressionChangedAfterItHasBeenCheckedError*** 

```javascript
ngAfterViewChecked() {
  if (this.hostConfigOk) {
    this.calcListPaddingRight();
  }
}

calcListPaddingRight() {
  const scrollIsVisible = this.list.clientHeight < this.list.scrollHeight;
  this.wrapper.style.paddingRight = scrollIsVisible ? '0.3em' : '1em';
}
```
