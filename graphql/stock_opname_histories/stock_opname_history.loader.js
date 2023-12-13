import DataLoader from 'dataloader'

import StockOpnameHistoryModel from './stock_opname_history.model.js'

const batchStockOpnameHistories = async stockOpnameHistoryIds => {
  const stock_opname_histories = await StockOpnameHistoryModel.find({
    _id: { $in: stockOpnameHistoryIds }
  }).lean()

  const dataMap = new Map()
  stock_opname_histories.forEach(stock_opname_history => {
    dataMap.set(stock_opname_history._id.toString(), stock_opname_history)
  })

  return stockOpnameHistoryIds.map(id => dataMap.get(id.toString()))
}

export default function StockOpnameHistoryLoader() {
  return new DataLoader(batchStockOpnameHistories)
}
