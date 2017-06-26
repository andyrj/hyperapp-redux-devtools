var { createStore } = require('redux');
var { composeWithDevTools } = require('redux-devtools-extension');

module.exports = function devtools(options) {
	if (!options) options = {}

	function reducer(state = {}, action) {
		return Object.assign({}, state, action.payload);
	}

	function action(name, data) {
		return {
			type: name,
			payload: data
		};
	}

	return function (app) {
		var composeEnhancers = composeWithDevTools({ action: action });

		var store;
		
		var plugin = {
			actions:{
				replaceState: function(state) {
					return store.getState();	
				}
			},
			events: {
				loaded: function(state, actions, _, emit) {
					store = createStore(reducer, state, composeEnhancers());
					// this should handle updating the hyperapp state from redux-devtools-extension
					store.subscribe(function() {
						actions.replaceState();
					});
				},
				action: function(name, data) {
					store.dispatch({ type: name, payload: data }); 
					//return data; // preventing action here so redux-devtools-extension will handle state for dev
				}
			}
		};

		return plugin;
	}
}
