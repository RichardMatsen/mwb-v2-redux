
export function spreadSelector(context: {self: any, baseSelector: string[]}) {
  /*
    Take a base selector (in array format) and create selectors for each of it's properties.
  */
 context.self.store.select(context.baseSelector)              // get a section of the store
 .waitFor$((base) => Object.keys(base).length)                // first emit is an empty object, wait for properties to appear
    .subscribe(baseData => {
      Object.keys(baseData)                                      // get the property names on the section
        .filter(key => !context.self.hasOwnProperty(key + '$'))  // ignore if the observable property already exists
        .forEach(key => context.self[key + '$'] = context.self.store.select([...context.baseSelector, key]) );
    });
}
