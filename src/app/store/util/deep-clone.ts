
export function deepClone(state) {

  if (Array.isArray(state)) {
    const newState = [];
    for (let index = 0; index < state.length; index++) {
      const element = state[index];
        newState[index] = deepClone(element);
    }
    return newState;
  };
  if (typeof state === 'object') {
    const newState = {...state};
    Object.keys(newState).forEach(key => {
      if (newState.hasOwnProperty(key)) {
        const val = newState[key];
        newState[key] = deepClone(val);
      }
    });
    return newState;
  };

  return state;
};
