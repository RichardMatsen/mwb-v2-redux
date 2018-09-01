// tslint:disable:interface-over-type-literal

export type FileState = {
  fileList: {
    files: string[]
    pending: boolean
    error?: any
  }
};

export const fileInitialState = {
  fileList: {
    files: null,
    pending: false,
    error: null
  }
};
