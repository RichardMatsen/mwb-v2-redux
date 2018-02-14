// tslint:disable-next-line:prefer-const

declare var hot, cold, expectObservable, expectSubscriptions, rxTestScheduler, array2Object, object2Array;
require('testing-helpers/marble-testing/helpers/test-helper2.hlpr');
import { TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { IFileInfo } from '../../model/fileinfo.model';
import { DataService } from '../data-service/data.service';
import { ListFormatterService } from './list-formatter.service';

describe('Marble tests for list-updater-observable-extensions', () => {

  describe('newFiles$', () => {
    it('finds items in incoming file list that arent in the old list', () => {
      const incomingFiles = {a: {name: 'file1'}, b: {name: 'file2'}, c: {name: 'file3'}};
      const incoming$ = cold( '---a---b---c---|', incomingFiles);
      const expected =        '-------b---c---|';

      const oldFiles = [{name: 'file1'}];
      const result$ = incoming$.newFiles$(oldFiles);
      const resultFiles = {b: {name: 'file2'}, c: {name: 'file3'}};
      expectObservable(result$).toBe(expected, resultFiles);
    });
  });

  describe('mergeWithExisting$', () => {
    it('adds new files to the old list', () => {
      const newFiles = {b: {name: 'file2'}, c: {name: 'file3'}};
      const new$ = cold( '----b---c---|', newFiles);
      const expected =   'a---b---c---|';

      const oldFiles = [{name: 'file1'}];
      const result$ = new$.mergeWithExisting$(oldFiles);
      const resultFiles = {a: {name: 'file1'}, b: {name: 'file2'}, c: {name: 'file3'}};
      expectObservable(result$).toBe(expected, resultFiles);
    });
  });

  describe('sorted$', () => {
    it('sorts a file list by criteria of a comparer function', () => {
      const files = {
        a: {name: 'file1', effectiveDate: new Date(2016, 6, 1)},
        b: {name: 'file2', effectiveDate: new Date(2016, 6, 2)},
        c: {name: 'file3', effectiveDate: new Date(2016, 6, 3)}
      };
      const unsorted$ = cold( '--b--a--c--|', files);
      const expected =        '-----------(cba|)';

      const result$ = unsorted$.sort$(ListFormatterService.fileInfoComparer);
      expectObservable(result$).toBe(expected, files);
    });
  });

  describe('doAsArray$', () => {
    it('performs an action on observable converted to array, and returns the original observable untouched', () => {
      const files = {
        a: {name: 'file1', effectiveDate: new Date(2016, 6, 1)},
        b: {name: 'file2', effectiveDate: new Date(2016, 6, 2)},
        c: {name: 'file3', effectiveDate: new Date(2016, 6, 3)}
      };
      const files$ = cold( '--a--b--c--|', files);
      const expected =     '-----------(abc|)';

      let sideEffect = { array: null };
      const action = (array) => sideEffect.array = array;

      // Expect the same observable out
      const result$ = files$.doAsArray$(action);
      // expectObservable(result$).toBe(expected, files);  

      // Expect the action to be called
      sideEffect = { array: null };
      result$.subscribe(result => {
        expect(sideEffect.array.length).toEqual( object2Array(files).length );
        // expect(sideEffect.array).toEqual( object2Array(files) );
      });
    });
  });

});
