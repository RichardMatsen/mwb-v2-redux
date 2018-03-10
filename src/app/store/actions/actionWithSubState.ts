
/*
  Map state handed to reducer into a sub-component, e.g
  for generic page components, the Page reducer needs to act on a single page
  but the actions are common to all pages, so we don't want to repeat the reducer
  for each individual page.
*/
export interface ActionWithSubState {
  type: string;
  subState: string;
}
