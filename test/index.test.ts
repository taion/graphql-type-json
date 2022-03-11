import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  graphql,
  GraphQLScalarType,
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

function createSchema(type: GraphQLScalarType) {
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
          resolve: (obj) => obj,
        },
      },
    }),
    types: [GraphQLInt],
  });
}

describe('GraphQLJSON', () => {
  let schema: GraphQLSchema;

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
      ).then(({ data, errors }) => {
        expect(data?.rootValue).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query ($arg: JSON!) {
            value(arg: $arg)
          }
        `,
        null,
        null,
        {
          arg: FIXTURE,
        },
      ).then(({ data, errors }) => {
        expect(data?.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query ($intValue: Int = 3) {
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
      ).then(({ data, errors }) => {
        expect(data?.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should handle null literal', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: null)
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toEqual({
          value: null,
        });
        expect(errors).toBeUndefined();
      }));

    it('should handle list literal', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: [])
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toEqual({
          value: [],
        });
        expect(errors).toBeUndefined();
      }));

    it('should reject invalid literal', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: INVALID)
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: Expected value of type "JSON", found INVALID; JSON cannot represent value: INVALID],
          ]
        `);
      }));
  });
});

describe('GraphQLJSONObject', () => {
  let schema: GraphQLSchema;

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
      ).then(({ data, errors }) => {
        expect(data?.rootValue).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should reject string value', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query {
            rootValue
          }
        `,
        'foo',
      ).then(({ data, errors }) => {
        expect(data?.rootValue).toBeNull();
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: JSONObject cannot represent non-object value: foo],
          ]
        `);
      }));

    it('should reject array value', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query {
            rootValue
          }
        `,
        [],
      ).then(({ data, errors }) => {
        expect(data?.rootValue).toBeNull();
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: JSONObject cannot represent non-object value: ],
          ]
        `);
      }));
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query ($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        null,
        null,
        {
          arg: FIXTURE,
        },
      ).then(({ data, errors }) => {
        expect(data?.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should reject string value', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query ($arg: JSONObject!) {
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
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: Variable "$arg" got invalid value "foo"; Expected type "JSONObject". JSONObject cannot represent non-object value: foo],
          ]
        `);
      }));

    it('should reject array value', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query ($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        null,
        null,
        {
          arg: [],
        },
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: Variable "$arg" got invalid value []; Expected type "JSONObject". JSONObject cannot represent non-object value: ],
          ]
        `);
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql(
        schema,
        /* GraphQL */ `
          query ($intValue: Int = 3) {
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
      ).then(({ data, errors }) => {
        expect(data?.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should reject string literal', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: "foo")
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: Expected value of type "JSONObject", found "foo"; JSONObject cannot represent non-object value: "foo"],
          ]
        `);
      }));

    it('should reject array literal', () =>
      graphql(
        schema,
        /* GraphQL */ `
          {
            value(arg: [])
          }
        `,
      ).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toMatchInlineSnapshot(`
          Array [
            [GraphQLError: Expected value of type "JSONObject", found []; JSONObject cannot represent non-object value: []],
          ]
        `);
      }));
  });
});
