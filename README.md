# is_session_locked

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Detect whether the Windows user session is locked..

Typically used to decide whether the computer can be used for backgoround tasks.

## Installation

```sh
npm install is_session_locked
```

## API

```js
var isl = require('is_session_locked');

setInterval(
    function() { console.log("is_session_locked", isl.is_session_locked()); }, 
    2000);
```

### is_session_locked()

Returns `true` if no user is logged-in or if the session is locked.

Return `false` if the user is logged-in and the session is in use.


## License

[BSD-3-Clause](LICENSE)

[npm-image]: https://img.shields.io/npm/v/is_session_locked.svg
[npm-url]: https://npmjs.org/package/is_session_locked
[downloads-image]: https://img.shields.io/npm/dm/is_session_locked.svg
[downloads-url]: https://npmjs.org/package/is_session_locked
