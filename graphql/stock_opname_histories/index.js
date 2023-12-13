import StockOpnameHistoryLoader from './stock_opname_history.loader.js'
import StockOpnameHistoryModel from './stock_opname_history.model.js'
import resolvers from './stock_opname_history.resolver.js'
import typeDefs from './stock_opname_history.typedef.js'

export default {
  typeDefs,
  resolvers,
  StockOpnameHistoryModel,
  StockOpnameHistoryLoader
}
