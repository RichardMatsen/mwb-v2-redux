
## Functional Issues

- Some of the Linqpad output html has event handlers linked to javascript that does not exist, or does not work inside the Angular app.

e.g
**Emergency RI checks (03 Jul 2016 - 17.12).html**

```html
    <a href="" class="typeheader" onclick="return toggle('t11');">
      <span class="typeglyphx" id="t11ud">˄</span>
      List&lt;RIResult&gt; (9 items)
    </a>
```

## Browser Issues

- Moz, Edge - scrollbar styling not working (https://css-tricks.com/forums/topic/css-tags-for-mozilla-browser-to-style-scrollbar/)

- Moz, Edge - path text in ReferentialDiagram not showing (appears stacked at upper right in Moz non-maximized window)

- Edge - url works but creates console error:

HTML1300: Navigation occurred.
referentials
HTTP404: NOT FOUND - The server has not found anything matching the requested URI (Uniform Resource Identifier).
(XHR)GET - http://localhost:4200/referentials

- Chrome, Moz - content spilling out of md-card in non-maximized window
