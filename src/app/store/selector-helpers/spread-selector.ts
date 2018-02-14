
export function spreadSelector(context, baseSelector: string[]) {
  const subscription = context.self.ngRedux.select(baseSelector)
    .subscribe(baseData => {
      Object.keys(baseData).forEach(key => {
        if (!context.self.hasOwnProperty(key + '$')) {
          const newSelector = baseSelector.slice();
          newSelector.push(key);
          context.self[key + '$'] = context.self.ngRedux.select(newSelector);
        }
      });
    });
  return subscription;
}
