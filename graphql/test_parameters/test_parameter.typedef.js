const typeDefs = `#graphql
  extend type Query {
    getOneTestParameter(_id: ID): TestParameter
    getAllTestParameters: [TestParameter]
  }

  extend type Mutation {
    createUpdateTestParameter(_id: ID, test_parameter_input: TestParameterInput): TestParameter
  }

  input TestParameterInput {
    test_parameter_name: String
    instrument: ID
    is_measurable: Boolean
    price: Float
  }

  type TestParameter {
    _id: ID
    test_parameter_name: String
    instrument: Instrument
    is_measurable: Boolean
    price: Float
  }
`

export default typeDefs
