# hyperapp-redux-devtools
hyperapp HOA (higher order app) to utilize redux-devtools-extension from hyperapp

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

### Dev vs. Prod

When deploying a Hyperapp with this HOA, it is advised you don't ship the devtools bundle with it:

#### With Webpack Dynamic Import

```js
import { h, app } from 'hyperapp';

let main;

if (process.env.NODE_ENV !== 'production') {
  import('hyperapp-redux-devtools')
    .then((devtools) => {
      main = devtools(app)(...);
    });
} else {
  main = app(...);
}
```

#### With Conditional Require (Rollup/Gulp/etc..)

```js
import { h, app } from 'hyperapp';
const devtools = process.env.NODE_ENV !== 'production'
  ? require('hyperapp-redux-devtools')
  : null;

let main;

if (devtools) {
  main = devtools(app)(...);
} else {
  main = app(...);
}
```
