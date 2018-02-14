// tslint:disable:interface-over-type-literal

export type UiState = {
  activeRequests?: number,
  four0four?: {
    caller?: string,
    message?: string,
    url?: string,
    methodArgs?: string
  },
};

export const uiInitialState: UiState = {
  activeRequests: 0,
  four0four: {},
};
