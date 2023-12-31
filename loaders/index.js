import InstrumentLoader from '../graphql/instruments/instrument.loader.js'
import SampleLoader from '../graphql/samples/sample.loader.js'
import StockOpnameHistoryLoader from '../graphql/stock_opname_histories/stock_opname_history.loader.js'
import StockOpnameLoader from '../graphql/stock_opnames/stock_opname.loader.js'
import TestParameterLoader from '../graphql/test_parameters/test_parameter.loader.js'
import TestLoader from '../graphql/tests/test.loader.js'
import UserLoader from '../graphql/users/user.loader.js'

export function loaders() {
  return {
    UserLoader: UserLoader(),
    TestLoader: TestLoader(),
    TestParameterLoader: TestParameterLoader(),
    SampleLoader: SampleLoader(),
    InstrumentLoader: InstrumentLoader(),
    StockOpnameLoader: StockOpnameLoader(),
    StockOpnameHistoryLoader: StockOpnameHistoryLoader()
  }
}
