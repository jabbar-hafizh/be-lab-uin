import DataLoader from 'dataloader'

import StockOpnameModel from './stock_opname.model.js'

const batchStockOpnames = async stockOpnameIds => {
  const stock_opnames = await StockOpnameModel.find({ _id: { $in: stockOpnameIds } }).lean()

  const dataMap = new Map()
  stock_opnames.forEach(stock_opname => {
    dataMap.set(stock_opname._id.toString(), stock_opname)
  })

  return stockOpnameIds.map(id => dataMap.get(id.toString()))
}

export default function StockOpnameLoader() {
  return new DataLoader(batchStockOpnames)
}
