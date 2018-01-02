# hyperapp-redux-devtools
hyperapp HOA(higher order app) to utilize redux-devtools-extension from hyperapp

```js
import { h, app } from 'hyperapp';
import devtools from 'hyperapp-redux-devtools';

devtools(app)(
  { count: 0 },
  {
    increment: () => (state) => Object.assign({}, state, { count: state.count + 1 })
  },
  (state, actions) => {
    return (
      <div>
        <button onclick={actions.increment}>Click</button>
        <span>{state.count}</span>
      </div>
    );
  },
  document.body
);

```
