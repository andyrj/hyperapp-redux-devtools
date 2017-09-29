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
          return function() {
            return function(data) {
              // equivalent to events.update
              var action = info.name;
              if (store !== undefined && action !== "replaceState") {
                store.dispatch({ type: action, payload: data });
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
};
