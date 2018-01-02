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
    var appActions;
    Object.keys(actions || {}).forEach(function (key) {
      var act = actions[key];
      actions[key] = function() {
        inAction = true;
        var result = act.apply(this, arguments)(appActions.getState(), actions);
        store.dispatch(action(key, result));
        inAction = false;
        return result;
      };
    });
    actions.getState = function() {
      return function(state) {
        return state;
      }
    };
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
    appActions = app(state, actions, view, container);
    return appActions;
  };
};
