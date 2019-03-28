import {
  graphql,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import GraphQLJSON, { GraphQLJSONObject } from '../src';

const FIXTURE = {
  string: 'string',
  int: 3,
  float: 3.14,
  true: true,
  false: false,
  null: null,
  object: {
    string: 'string',
    int: 3,
    float: 3.14,
    true: true,
    false: false,
    null: null,
  },
  array: ['string', 3, 3.14, true, false, null],
};

function createSchema(type) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        value: {
          type,
          args: {
            arg: { type },
          },
          resolve: (obj, { arg }) => arg,
        },
        rootValue: {
          type,
          resolve: obj => obj,
        },
      },
    }),
    types: [GraphQLInt],
  });
}

describe('GraphQLJSON', () => {
  let schema;

  beforeEach(() => {
    schema = createSchema(GraphQLJSON);
  });

  describe('serialize', () => {
    it('should support serialization', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query {
            rootValue
          }
        `,
        FIXTURE,
      ).then(({ data }) => {
        expect(data.rootValue).toEqual(FIXTURE);
      }));
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query($arg: JSON!) {
            value(arg: $arg)
          }
        `,
        null,
        null,
        {
          arg: FIXTURE,
        },
      ).then(({ data }) => {
        expect(data.value).toEqual(FIXTURE);
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query($intValue: Int = 3) {
            value(
              arg: {
                string: "string"
                int: $intValue
                float: 3.14
                true: true
                false: false
                null: null
                object: {
                  string: "string"
                  int: $intValue
                  float: 3.14
                  true: true
                  false: false
                  null: null
                }
                array: ["string", $intValue, 3.14, true, false, null]
              }
            )
          }
        `,
      ).then(({ data }) => {
        expect(data.value).toEqual(FIXTURE);
      }));

    it('should handle null literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: null)
          }
        `,
      ).then(({ data }) => {
        expect(data).toEqual({
          value: null,
        });
      }));

    it('should reject invalid literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: INVALID)
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));
  });
});

describe('GraphQLJSONObject', () => {
  let schema;

  beforeEach(() => {
    schema = createSchema(GraphQLJSONObject);
  });

  describe('serialize', () => {
    it('should support serialization', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query {
            rootValue
          }
        `,
        FIXTURE,
      ).then(({ data }) => {
        expect(data.rootValue).toEqual(FIXTURE);
      }));

    it('should reject invalid values', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query {
            rootValue
          }
        `,
        'foo',
      ).then(({ data, errors }) => {
        expect(data.rootValue).toBeNull();
        expect(errors).toBeDefined();
      }));
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        null,
        null,
        {
          arg: FIXTURE,
        },
      ).then(({ data }) => {
        expect(data.value).toEqual(FIXTURE);
      }));

    it('should reject invalid values', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        null,
        null,
        {
          arg: 'foo',
        },
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query($intValue: Int = 3) {
            value(
              arg: {
                string: "string"
                int: $intValue
                float: 3.14
                true: true
                false: false
                null: null
                object: {
                  string: "string"
                  int: $intValue
                  float: 3.14
                  true: true
                  false: false
                  null: null
                }
                array: ["string", $intValue, 3.14, true, false, null]
              }
            )
          }
        `,
      ).then(({ data }) => {
        expect(data.value).toEqual(FIXTURE);
      }));

    it('should reject invalid literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: "foo")
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));
  });
});
