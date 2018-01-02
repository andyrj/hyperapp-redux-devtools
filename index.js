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
    Object.keys(actions || {}).forEach(function (key) {
      var action = actions[key];
      actions[key] = function() {
        inAction = true;
        var result = action.apply(this, arguments);
        store.dispatch(action(key, result));
        inAction = false;
        return result;
      };
    });
    actions.replaceState = function() {
      return function (state, actions) {
        return store.getState();
      }
    };
    store = createStore(reducer, state, composeEnhancers());
    store.subscribe(function() {
      if (!inAction) {
        actions.replaceState(store.getState());
      }
    });
    return app(state, actions, view, container);
  };
};
