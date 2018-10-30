# black-box

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dependency Status](https://img.shields.io/david/m31271n/black-box.svg)](#)
[![DevDependency Status](https://img.shields.io/david/m31271n/black-box.svg)](#)
[![NPM Downloads](https://img.shields.io/npm/dm/@m31271n/black-box.svg)](#)

> Toolbox for [Black Engine](https://github.com/MassiveHeights/Black).

## Dependencies

This package is published as ES6 module currently, you need to use Babel or other transpilers.

Moreover, if you use `Debug/Console` you also need `@babel/plugin-syntax-dynamic-import`.

## Install

```
$ npm install @m31271n/black-box
```

## Usage

```js
// examples
import { SceneManager, Scene } from 'black-box'
import { Fade } from 'black-box/Animation'

// or specific module directly
import Fade from 'black-box/Animation/Fade'
```

## License

[MIT](https://stack.m31271n.com/licenses/MIT.txt) © [m31271n](https://stack.m31271n.com)
