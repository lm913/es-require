# Adobe ExtendScript Require

Function `require` compatible with _commonjs_

## Why?

In Adobe ExtendScript `#include` used for loading dependencies.
It puts all modules to global scope. With `require` it could be avoided.

## Example

***main.js***
```js
"use strict";
#include "./lib/require.js";

require.dir(File($.fileName).path + "/lib/");
var testLib_1 = require("./testLib");

require.dir(File($.fileName).parent.parent.path + "/lib/");
var testLib_2 = require("./../../testLib2");

function main() {
    testLib_1["default"]();
    testLib_2["default"]();
}
main();
```

***testLib.js***
```js
"use strict";
function mang() {
    $.writeln("hello");
}
exports["default"] = mang;
```

***testLib2.js***
```js
"use strict";
function mang2() {
    $.writeln("goodbye");
}
exports["default"] = mang2;
```

## See Also

- [es-require for node.js](https://github.com/coderaiser/es-require)

## License

MIT
