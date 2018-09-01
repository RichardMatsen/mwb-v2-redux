
const deepFreeze = function (o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (o.hasOwnProperty(prop)
    && o[prop] !== null
    && (typeof o[prop] === 'object')
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });

  return o;
};

const freezeState = function (store) {
  return (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    deepFreeze(state);
    return result;
  };
};

export {
  deepFreeze,
  freezeState
};
