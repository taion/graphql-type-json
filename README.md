# graphql-type-json [![Travis][build-badge]][build] [![npm][npm-badge]][npm]

JSON scalar type for [GraphQL.js](https://github.com/graphql/graphql-js).

[![Codecov][codecov-badge]][codecov]

## Usage

```js
import { makeExecutableSchema } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';

const typeDefs = `
scalar JSON

type Foo {
  someField: JSON
}

type Query {
  foo: Foo
}
`;

const resolvers = {
  JSON: GraphQLJSON
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
```

Now you can pass JS objects as params :tada:

[build-badge]: https://img.shields.io/travis/taion/graphql-type-json/master.svg
[build]: https://travis-ci.org/taion/graphql-type-json

[npm-badge]: https://img.shields.io/npm/v/graphql-type-json.svg
[npm]: https://www.npmjs.com/package/graphql-type-json

[codecov-badge]: https://img.shields.io/codecov/c/github/taion/graphql-type-json/master.svg
[codecov]: https://codecov.io/gh/taion/graphql-type-json
