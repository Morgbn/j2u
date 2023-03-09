# J2U
JSON Schema based form generator built with vue 3

### Installation
```sh
yarn add j2u # npm i j2u
```

### Basic Usage
```html
<JsonSchema :schema="schema" v-model="value"/>
```
```js
schema = {
    type: 'object',
    properties: {
      aaa: { type: 'string', minLength: 1 },
      bbb: { type: 'boolean' },
      ccc: { type: 'string', enum: ['1', '2', '3'] },
      ddd: {
        type: 'object',
        title: '',
        properties: {
          a1: { type: 'string', minLength: 1, maxLength: 5 },
          b2: { type: 'boolean', default: true },
          ddd: {
            type: 'object',
            properties: {
              a1: { type: 'string', default: 'aaa' },
              b2: { type: 'boolean' }
            }
          }
        }
      }
    }
}
```

### Credits
- inspired by [vue-jsonschema-form](https://github.com/roma219/vue-jsonschema-form) and [ncform](https://github.com/ncform/ncform)