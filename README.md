# easy-rest-client

[![Travis](https://img.shields.io/travis/PSDCoder/easy-rest-client.svg?style=flat-square)](https://travis-ci.org/PSDCoder/easy-rest-client)
[![npm version](https://img.shields.io/npm/v/easy-rest-client.svg?style=flat-square)](https://www.npmjs.com/package/easy-rest-client)
[![npm downloads](https://img.shields.io/npm/dm/easy-rest-client.svg?style=flat-square)](https://www.npmjs.com/package/easy-rest-client)

Rest client with simplest and convenient API.

## Installation

For install stable version:

```
npm install --save easy-rest-client
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager.  
You can use this function as [CommonJS](http://webpack.github.io/docs/commonjs.html) module. This module is what you get when you import `paginationBuilder` in a [Webpack](http://webpack.github.io), [Browserify](http://browserify.org/), or a Node environment.

If you don’t use a module bundler, it’s also fine. The `paginationBuilder` npm package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the `dist` folder. They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. For example, you can drop a UMD build as a `<script>path to /dist/easy-rest-client.js</script>` on the page. The UMD build make `RestClient` available as a `window.easyRestClient.default` global variable.

The source code is written in ES2015 but we precompile both CommonJS and UMD builds to ES5 so they work in [any modern browser](http://caniuse.com/#feat=es5). You don’t need to use Babel or a module bundler.


## Example of usage

```javascript
import RestClient from 'easy-rest-client';

const client = new RestClient('https://someyourapi.host', {
    headers: {
        accept: JSON_CONTENT_TYPE,
        contentType: JSON_CONTENT_TYPE
    },
    fetch: {
        mode: 'cors',
        cache: 'default'
    },
    trailing: false,
    interceptors: {
        request: [],
        response: []
    }
});
```

## MODULE PUBLIC API

* RestClient as default
* fetch
* buildUrl
* contentTypes


