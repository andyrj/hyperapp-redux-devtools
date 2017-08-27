var { createStore } = require("redux");
var { composeWithDevTools } = require("redux-devtools-extension");

module.exports = function devtools(options) {
  if (!options) options = {};

  function reducer(state = {}, action) {
    return Object.assign({}, state, action.payload);
  }

  function action(name, data) {
    return {
      type: name,
      payload: data
    };
  }

  return function(app) {
    var composeEnhancers = composeWithDevTools({ action: action });

    var store;
    var firedActions = [];

    var plugin = {
      actions: {
        replaceState: function(state) {
          return store.getState();
        }
      },
      events: {
        load: function(state, actions) {
          store = createStore(reducer, state, composeEnhancers());
          store.subscribe(function() {
            actions.replaceState(state);
          });
        },
        action: function(state, actions, data, emit) {
          if (data.name !== "replaceState") {
            firedActions.push(data.name);
          }
          return data;
        },
        resolve(state, actions, result) {
          if (typeof result === "function") {
            const action = firedActions.pop()
            return update => {
              result(updateResult => {
                firedActions.push(action)
                update(updateResult)
              })
            }
          }
        },
        update: function(state, actions, data, emit) {
          if (firedActions.length > 0 && store !== undefined) {
            store.dispatch({ type: firedActions.pop(), payload: data });
          }
        }
      }
    };

    return plugin;
  };
};
