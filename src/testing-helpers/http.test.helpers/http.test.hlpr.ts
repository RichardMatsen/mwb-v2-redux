import { Response, ResponseOptions } from '@angular/http';

// Ref: https://stackoverflow.com/a/45171930/8745435
export class MockError extends Response implements Error {
  name: any;
  message: any;
  constructor(status: number, body: string = '') {
      super(new ResponseOptions({status, body}));
  }
}

export class MockResponse extends Response {
  name: any;
  constructor(status: number, body: string = '') {
    super(new ResponseOptions({status, body}));
  }
}
