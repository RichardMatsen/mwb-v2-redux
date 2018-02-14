// tslint:disable:interface-over-type-literal

export type SearchState = {
  page?: string,
  pageIsSearchable?: boolean,
  searchTerm?: string,
  results?: string[]
};

export const searchInitialState: SearchState = {
  page: null,
  pageIsSearchable: false,
  searchTerm: null,
  results: []
};
