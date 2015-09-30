simple hard captcha
----------

[![npmjs](https://img.shields.io/npm/v/simple-hard-captcha.svg)](https://www.npmjs.com/package/simple-hard-captcha)

## Usage

`$ npm install simple-hard-captcha`

```javascript
var SHC = require('simple-hard-captcha');

var shc = new SHC();
shc.draw();

shc.result;      // get the result
shc.toDataUrl(); // get base64 string of captcha image
```

## Demo
![demo](https://github.com/quietshu/simple-hard-captcha/raw/master/demo.png)

## License
WTFPL

[@farteryhr](https://github.com/farteryhr)

[@quietshu](https://github.com/quietshu)

<3
