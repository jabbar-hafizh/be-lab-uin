const typeDefs = `#graphql
  extend type Query {
    getOneSample(_id: ID): Sample
    getAllSamples: [Sample]
  }

  extend type Mutation {
    createUpdateSample(_id: ID, sample_input: SampleInput): Sample
  }

  input SampleInput {
    _id: ID
    customer_label: String
    lab_label: String
    results: [SampleResultInput]
  }

  input SampleResultInput {
    test_parameter: ID
    unit_of_measurement: String
    result: String
    test_date: String
    method: String
  }

  type Sample {
    _id: ID
    customer_label: String
    lab_label: String
    results: [SampleResult]
    test_date: String
    method: String
    createdAt: String
    updatedAt: String
  }

  type SampleResult {
    test_parameter: TestParameter
    unit_of_measurement: String
    result: String
  }
`

export default typeDefs
