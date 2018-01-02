# hyperapp-redux-devtools
hyperapp HOA(higher order app) to utilize redux-devtools-extension from hyperapp

```js
import { h, app } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';

devtools(app)({
  state: { count: 0 },
  view: (state, actions) => {
    return (
      <div>
        <button onclick={actions.increment}>Click</button>
        <span>{state.count}</span>
      </div>
    );
  },
  actions: {
    increment: (state) => Object.assign({}, state, { count: state.count + 1 })
  }
});

```
