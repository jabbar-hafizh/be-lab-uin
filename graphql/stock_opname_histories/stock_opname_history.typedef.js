const typeDefs = `#graphql
  extend type Query {
    getOneStockOpnameHistory(_id: ID): StockOpnameHistory
    getAllStockOpnameHistories(filter: StockOpnameHistoryFilterInput): [StockOpnameHistory]
  }

  extend type Mutation {
    createStockOpnameHistory(stock_opname_history_input: StockOpnameHistoryInput): StockOpnameHistory
    updateStockOpnameHistory(_id: ID, stock_opname_history_input: StockOpnameHistoryInput): StockOpnameHistory
    deleteStockOpnameHistory(_id: ID!): StockOpnameHistory
  }

  input StockOpnameHistoryInput {
    stock_opname: ID
    user: String
    date: String
    number: Float
  }

  type StockOpnameHistory {
    _id: ID
    stock_opname: StockOpname
    user: String
    date: String
    date_formatted: Float
    number: Float
  }

  input StockOpnameHistoryFilterInput {
    start_date: String
    end_date: String
    stock_opname_id: ID
  }
`

export default typeDefs
