# Thumbnail Dropdown Panel

## Feature: A drop-down panel to display narrative text about the metric.
- Small button at the bottom right of the thumbnail
- Change from down-chevron to up-chevron upon toggle
- No button if no narrative text
- Animated change

**Implementation**  
Use bootsrap collapse as it is the simplest implementaion of show/hide with animation.  
The narative text div:
```javascript
    <div [id]="'narrtext_'+measure.id" class="collapse">
```
The toggle button:
```javascript
    <a class="narrative-button" data-toggle="collapse" [attr.data-target]="'#narrtext_'+measure.id">
```
Note the use of 'attr.' prefix on data-target to prevent error _"Can't bind to 'data-target' since it isn't a known property of 'a'."_  
Note the data-target id has suffix of measure.id to give each thumbnail a unique reference.

**Changing button icon**  
Can't use ngIf on the icons because the structural change stops collapse from working.
```javascript
  <i class="fa fa-chevron-down" *ngIf="!isExpanded" aria-hidden="true"></i>
  <i class="fa fa-chevron-up" *ngIf="isExpanded" aria-hidden="true"></i>
```

Use ngClass instead: 
```javascript
  `[ngClass]="{ 'fa-chevron-down': !isExpanded, 'fa-chevron-up': isExpanded }"`
```

**Click event**  
Simplest implementaion is to give the button the attribute `(click)="this.isExpanded = !this.isExpanded"`.  

Can also use click method with `(click)="click()"` on button and method of
```javascript
  click() { 
    this.isExpanded = !this.isExpanded; 
  }  
```

Can also use @HostListener decorator for more complex scenario:  
```javascript
  @HostListener('click', ['$event'])
  clickHandler(event) {
    const narText = this.elementRef.nativeElement.querySelector('#narrtext_'+this.measure.id); // Ref to affected div
    const open = narText.classList.contains('in');                                             // Query class
    this.isExpanded = !this.isExpanded;
    return true;  // chain to next handler
  } 
```
Note `return true` on clickhandler() allows other click events to happen (if they exist).  
Chaining isn't available with the simple declarative click event above.


**Placing the button**  
Use absolute positioning and offset from the corner.  
Note, bottom adjustment needs a media query for xs width to keep it tight to the bottom of the well on smaller screens.  
```javascript
  a.narrative-button {
    position:absolute;
    bottom: 20px; 
    right: 20px; 
    cursor: pointer;
  }
  @media only screen and (max-width: 768px) {
    a.narrative-button {
      bottom: 0; 
    }
  }
```
