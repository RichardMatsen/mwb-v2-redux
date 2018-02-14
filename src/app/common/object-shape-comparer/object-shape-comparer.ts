import { Injectable } from '@angular/core';

@Injectable()
export class ObjectShapeComparer {

  compare(expected, actual): string[] {
    return this.compareObjectShape(expected, actual);
  }

  private compareObjectShape(expected, actual, path = ''): string[] {
    let diffs = [];
    for (const key in expected) {
      // Ignore function properties
      if (!expected.hasOwnProperty(key) || typeof expected[key] === 'function') {
        continue;
      }

      const fullPath = path + (path === '' ? '' : '.') + key;

      // Property exists?
      if (!actual.hasOwnProperty(key)) {
        diffs.push(`Missing property ${fullPath}`);
        continue; // no need to check further when actual is missing
      }

      // Template value = undefined, means no type checking, no nested objects
      const expectedValue = expected[key];
      if (expectedValue === undefined) {
        continue;
      }

      // Types match?
      const expectedType = this.getType(expectedValue);
      const actualValue = actual[key];
      const actualType = this.getType(actualValue);
      if (expectedType !== actualType) {
        diffs.push(`Types differ for property ${fullPath} (${expectedType} vs ${actualType})`);
      }

      // Recurse nested objects and arrays
      diffs = diffs.concat(this.recurse(expectedValue, actualValue, fullPath));
    }
    return diffs;
  }

  private recurse(expectedValue, actualValue, path): string[] {
    let diffs = [];
    const expectedType = this.getType(expectedValue);
    if (expectedType === 'array') {
      diffs = diffs.concat(this.compareArrays(expectedValue, actualValue, path));
    }
    if (expectedType === 'object') {
      diffs = diffs.concat(this.compareObjectShape(expectedValue, actualValue, path));
    }
    return diffs;
  }

  private compareArrays(expectedArray, actualArray, path): string[] {
    let diffs = [];
    if (expectedArray.length === 0 || this.arrayIsPrimitive(expectedArray)) {
      return diffs;
    }

    // Look for expected element anywhere in the actuals array
    const actualKeys = actualArray.map(element => this.getKeys(element).join(','));
    for (let index = 0; index < expectedArray.length; index++) {
      const fullPath = path + '.' + index;
      const expectedElement = expectedArray[index];
      const actualElement = this.actualMatchingExpected(expectedElement, actualArray);
      if (!actualElement) {
        diffs.push(`Missing array element ${fullPath} (keys: ${this.getKeys(expectedElement).join(',')})`);
        continue;
      }
      diffs = diffs.concat(this.recurse(expectedElement, actualElement, fullPath));
    };
    return diffs;
  }

  private getKeys(obj): any[] {
    return typeof obj === 'object' ?
      Object.keys(obj)
        .filter(key => obj.hasOwnProperty(key)) // ignore function properties
        .sort()
      : [];
  }

  private getType(el: any): string {
    return Array.isArray(el) ? 'array' : typeof el;
  }

  private arrayIsPrimitive(array): boolean {
    const arrayType = this.getType(array[0]);
    return arrayType !== 'object' && arrayType !== 'array';
  }

  private actualMatchingExpected(expected, actuals): any {
    const expectedKeys = this.getKeys(expected).join(',');
    const actualKeys = actuals.map(element => this.getKeys(element).join(','));
    const match = actualKeys.indexOf(expectedKeys);
    // tslint:disable-next-line:no-bitwise
    return (~match) ? actuals[match] : null;
  }

}
