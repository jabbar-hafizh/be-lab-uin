import DataLoader from 'dataloader'
import InstrumentModel from './instrument.model.js'

const batchInstruments = async instrumentIds => {
  const instruments = await InstrumentModel.find({ _id: { $in: instrumentIds } }).lean()

  const dataMap = new Map()
  instruments.forEach(instrument => {
    dataMap.set(instrument._id.toString(), instrument)
  })

  return instrumentIds.map(id => dataMap.get(id.toString()))
}

export default function InstrumentLoader() {
  return new DataLoader(batchInstruments)
}
