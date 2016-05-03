# intl-wikipedia

Search from wikipedia for any language

## Install

Install using npm:
```sh
    $ npm install intl-wikipedia
```

## Usage

```javascript
const Intlpedia = require('intl-wikipedia')
const searchTerm = 'Bernie Sanders'
const intlpedia = new Intlpedia('zh')
intlpedia.search(searchTerm)
  .then(page => console.log(page))
  .catch(err => console.error(err))
```

## Test

Run tests:
```sh
    $ npm test
```

Tested with node.js v6.0+

## License
The MIT License (MIT)

Copyright (c) 2016