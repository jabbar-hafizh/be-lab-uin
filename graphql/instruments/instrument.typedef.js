const typeDefs = `#graphql
  extend type Query {
    getOneInstrument(_id: ID): Instrument
    getAllInstruments: [Instrument]
  }

  extend type Mutation {
    createUpdateInstrument(_id: ID, instrument_input: InstrumentInput): Instrument
  }

  input InstrumentInput {
    name: String
  }

  type Instrument {
    _id: ID
    name: String
    created_at: String
    updated_at: String
  }
`

export default typeDefs
