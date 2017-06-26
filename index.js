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

		var store = createStore(
			reducer,
			composeEnhancers()
		);

		var plugin = {
			events: {
				action: funtion (name, data) {
					store.dispatch({ type: name, payload: data })
				}
			}
		};

		return plugin;
	}
}
