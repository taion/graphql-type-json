import {
  graphql,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import GraphQLJSON from '../src';

const FIXTURE = {
  string: 'string',
  int: 3,
  float: Math.PI,
  true: true,
  false: true,
  null: null,
  object: {
    string: 'string',
    int: 3,
    float: Math.PI,
    true: true,
    false: true,
    null: null,
  },
  array: ['string', 3, Math.PI, true, false, null],
};

describe('GraphQLJSON', () => {
  let schema;

  beforeEach(() => {
    schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          value: {
            type: GraphQLJSON,
            args: {
              arg: {
                type: GraphQLJSON,
              },
            },
            resolve: (obj, { arg }) => arg,
          },
        },
      }),
      types: [GraphQLInt],
    });
  });

  describe('serialize', () => {
    it('should support serialization', () => {
      expect(GraphQLJSON.serialize(FIXTURE)).toEqual(FIXTURE);
    });
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql(schema, 'query ($arg: JSON!) { value(arg: $arg) }', null, null, {
        arg: FIXTURE,
      }).then(({ data }) => {
        expect(data.value).toEqual(FIXTURE);
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql(
        schema,
        `
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
        expect(data.value).toEqual({
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
        });
      }));

    it('should handle null literals', () =>
      graphql(
        schema,
        `
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
        `
          {
            value(arg: INVALID)
          }
        `,
      ).then(({ data }) => {
        expect(data).toBeUndefined();
      }));
  });
});
