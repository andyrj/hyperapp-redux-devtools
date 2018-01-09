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

module.exports = function devtools(app) {
  var composeEnhancers = composeWithDevTools({ action: action });
  var store;
  var inAction = false;

  return function(state, actions, view, container) {
    var appActions;
    Object.keys(actions || {}).forEach(function (key) {
      var act = actions[key];
      actions[key] = function() {
        var reducer = act.apply(this, arguments);
        return function (state) {
          var newState = reducer(state, appActions);
          inAction = true;
          store.dispatch(action(key, newState));
          inAction = false;
          return newState;
        };
      };
    });
    actions.replaceState = function(actualState) {
      return function (state) {
        return actualState;
      }
    };
    store = createStore(reducer, state, composeEnhancers());
    store.subscribe(function() {
      if (!inAction) {
        appActions.replaceState(store.getState());
      }
    });
    appActions = app(state, actions, view, container);
    return appActions;
  };
};

