// import { element } from 'protractor';

export const saveFile = function(_data) {
  const data = JSON.stringify(_data);
  const blob = new Blob([data], {type: 'text/plain'});

  const element = document.createElement('a');
  element.download = 'test.json';
  element.href = window.URL.createObjectURL(blob);
  element.dataset.downloadurl = ['text/json', element.download, element.href].join(':');

  const e = document.createEvent('MouseEvents');
  e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

  const event = new Event('MouseEvents');
  element.addEventListener('MouseEvents', function () {}, false);

  element.dispatchEvent(event);
}
