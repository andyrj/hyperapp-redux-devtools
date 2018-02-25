var { createStore } = require("redux");
var { composeWithDevTools } = require("redux-devtools-extension");

function reduxReducer(state = {}, action) {
  return Object.assign({}, state, action.payload);
}

function reducAction(name, data) {
  return {
    type: name,
    payload: data
  };
}

function copy(target, source) {
  var obj = {};
  for (var i in target) obj[i] = target[i];
  for (var i in source) obj[i] = source[i];
  return obj;
}

function set(path, value, source, target) {
  if (path.length) {
    target[path[0]] =
      1 < path.length ? set(path.slice(1), value, source[path[0]], {}) : value;
    return copy(source, target);
  }
  return value;
}

function get(path, source) {
  for (var i = 0; i < path.length; i++) {
    source = source[path[i]];
  }
  return source;
}

module.exports = function devtools(app) {
  var composeEnhancers = composeWithDevTools({ action: reducAction });
  var store;

  return function(state, actions, view, container) {
    var appActions;

    function wire(path, actions) {
      for (var key in actions) {
        if (typeof actions[key] === "function") {
          (function(key, action) {
            actions[key] = function() {
              var reducer = action.apply(this, arguments);
              return function (slice) {
                var data = typeof reducer === "function"
                  ? reducer(slice, get(path, appActions))
                  : reducer;
                if (data && !data.then) {
                  state = set(path, copy(slice, data), state, {});
                  store.dispatch(reducAction(key, state));
                }
                return data;
              };
            };
          })(key, actions[key]);
        } else {
          wire(path.concat(key), (actions[key] = copy(actions[key])));
        }
      }
    }
    wire([], (actions = copy(actions)));

    actions.replaceState = function(actualState) {
      return function (state) {
        return actualState;
      }
    };
    store = createStore(reduxReducer, state, composeEnhancers());
    store.subscribe(function() {
      appActions.replaceState(store.getState());
    });

    appActions = app(state, actions, view, container);
    return appActions;
  };
};

