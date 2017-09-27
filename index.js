var { createStore } = require("redux");
var { composeWithDevTools } = require("redux-devtools-extension");

module.exports = function devtools(props) {
  function reducer(state = {}, action) {
    return Object.assign({}, state, action.payload);
  }

  function action(name, data) {
    return {
      type: name,
      payload: data
    };
  }
  
  var composeEnhancers = composeWithDevTools({ action: action });
  
  var store;
  var firedActions = [];

  var devtoolsProps = {
    actions: {
      replaceState: function(state) {
        return store.getState();
      }
    },
    hooks: [
      function (state, actions) {
        // equivalent to events.load...
        store = createStore(reducer, state, composeEnhancers());
        store.subscribe(function() {
          actions.replaceState(store.getState());
        });
        return function(info) {
          // equivalent to events.actions
          if (info.name !== "replaceState") {
            firedActions.push(info.name);
          }
          return function(result) {
            //equivalent to events.resolve...
            if (typeof result === "function") {
              const action = firedActions.pop()
              return update => {
                result(updateResult => {
                  firedActions.push(action)
                  update(updateResult)
                })
              }
            }
            // return result; // not sure how to return result here and also handle update hook, maybe not needed...?
            return function(data) {
              // equivalent to events.update
              if (firedActions.length > 0 && store !== undefined) {
                var action = firedActions.pop();
                if (action !== "replaceState") {
                  store.dispatch({ type: action, payload: data });
                }
              }
              return data;
            }
          }
        }
      }
    ]
  };

  return Object.assign(props, {
    actions: devtoolsProps.actions,
    hooks: props.hooks.concat(devtoolsProps.hooks)
  });
  /*
  return function(app) {
    var mixin = {
      actions: {
        
      },
      events: {
        load: function(state, actions, root) {
          
        },
        action: function(state, actions, info) {
          
        },
        resolve(state, actions, result) {
          // how to re-write this...
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
  */
};
