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

    var mixin = {
      actions: {
        replaceState: function(state) {
          return store.getState();
        }
      },
      events: {
        load: function(state, actions, root) {
          store = createStore(reducer, state, composeEnhancers());
          store.subscribe(function() {
            actions.replaceState(state);
          });
        },
        action: function(state, actions, info) {
          if (info.name !== "replaceState") {
            firedActions.push(info.name);
          }
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
          return result;
        },
        update: function(state, actions, data) {
          if (firedActions.length > 0 && store !== undefined) {
            var action = firedActions.pop();
            if (action !== "replaceState") {
              store.dispatch({ type: action, payload: data });
            }
          }
          return data;
        }
      }
    };

    return mixin;
  };
};
