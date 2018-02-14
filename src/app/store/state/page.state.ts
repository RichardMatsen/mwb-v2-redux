// tslint:disable:interface-over-type-literal

import { IFileInfo } from '../../model/fileInfo.model';

export type PageStateRoot = {
  validations?: PageState;
  referentials?: PageState;
  clinics?: PageState;
};

export type PageState = {
  files?: IFileInfo[],
  fileInfo?: IFileInfo,
  lastRefresh?: string,
  fileCount?: number,
  numVisible?: number,
  visibleFiles?: IFileInfo[] | Function
  error?: any
};

export const pagesInitialState: PageStateRoot = {
  validations: {},
  referentials: {},
  clinics: {},
};
