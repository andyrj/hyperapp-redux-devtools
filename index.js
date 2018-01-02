var { createStore } = require("redux");
var { composeWithDevTools } = require("redux-devtools-extension");

function reducer(state = {}, action) {
  return Object.assign({}, state, action.payload);
}

function action(name, data) {
  return {
    type: name,
    payload: data
  };
}

module.export = function devtools(app) {
  var composeEnhancers = composeWithDevTools({ action: action });
  var store;
  var inAction = false;

  return function(state, actions, view, container) {
    Object.keys(actions || {}).forEach(key => {
      const action = actions[key];
      actions[key] = () => {
        inAction = true;
        const result = action.apply(this, arguments);
        store.dispatch(action(key, result));
        inAction = false;
        return result;
      }
    });
    actions.replaceState = () => (state, actions) => {
      return store.getState();
    };
    store = createStore(reducer, state, composeEnhancers());
        store.subscribe(function() {
          if (!inAction) {
            actions.replaceState(store.getState());
          }
        });
    return app(state, actions, view, container);
  }
};
