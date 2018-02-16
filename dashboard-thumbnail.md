# Component DashboardThumbnail

## Feature:
- A panel for each metric
- Panels vertically stacked, responsive
- Elements within panel should be vertically aligned
- Left side elements: icon and title
- Right side elements: badge with color and value
- Click icon and title to go to detail page
- Optional auth required on link

**Basic layout**  
Panels are implemented with bootstrap `class="well well-sm"` (responsive), with `{display: block}` (vertical stack)

**Aligning elements vertically**  
Content elements of the thumbnail are vertically aligned with `{display: flex}` on the enclosing div and `{margin: auto}` on the element.  
Content elements can also adjust left and right margins (but not top and bottom).
```javascript
div.metric {
  display: flex;
  justify-content: space-between;
}
error-badge {
  ...
  margin: auto;
  margin-left: 10px;
  margin-right: 10px;
}
```

**Shifting elements left and right**  
Left-side and right-side elements are separated by a filler element:
```javascript
<div class="filler"></div>

div.filler {
  flex-grow: 1;
}
```

**Linking to detail pages**  
Link is implemented with routerLink attribute:
  `<a class="measure" [routerLink]="['/'+ measure.link ]" >`.  
Auth on Task metric is implemented with a route guard in AppRoutingModule:  
```javascript
{ 
  path: 'tasks', 
  canActivate: [AuthguardService], 
  component: TasksComponent, 
  data: { toastrPrompt: 'Team Tasks'} 
}
```
The data attribute allows a common Authguard component to recieve use-specific static data (e.g Toastr text).