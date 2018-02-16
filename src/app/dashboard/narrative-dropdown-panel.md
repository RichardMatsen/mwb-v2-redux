# Thumbnail Dropdown Panel

## Feature: A drop-down panel to display narrative text about the metric.
- Small button at the bottom right of the thumbnail
- Change from down-chevron to up-chevron upon toggle
- No button if no narrative text
- Animated change

### **Implementation**  

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

### **Changing button icon**  

Can't use ngIf on the icons because the structural change stops collapse from working.
```javascript
<i class="fa fa-chevron-down" *ngIf="!isExpanded" aria-hidden="true"></i>
<i class="fa fa-chevron-up" *ngIf="isExpanded" aria-hidden="true"></i>
```

Use ngClass instead: 
```javascript
[ngClass]="{ 'fa-chevron-down': !isExpanded, 'fa-chevron-up': isExpanded }"
```

### **Click event**  

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
  const isOpen = narText.classList.contains('in');                                           // Query class
  this.isExpanded = !this.isExpanded;
  return true;  // chain to next handler
} 
```
Note `return true` on clickhandler() allows other click events to happen (if they exist).  
Chaining isn't available with the simple declarative click event above.


### **Placing the button**  

Initially used absolute positioning and offset from the corner,  
but this ***behaves eratically at differemt media settings and browsers***. 

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

Using **flexbox** proves to be reliable across all screen widths and all browsers. 

Ref: 
-  [Align button at the bottom of div using CSS](https://stackoverflow.com/a/43145082/8745435)  
-  [Basic concepts of flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)  
-  [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)  

```javascript
div.well {
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;  
  display: flex;
}
a.narrative-button {
  justify-content: flex-end;
  display: flex;
  cursor: pointer;
}
```
