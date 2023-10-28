import DataLoader from 'dataloader'
import SampleModel from './sample.model.js'

const batchSamples = async sampleIds => {
  const samples = await SampleModel.find({ _id: { $in: sampleIds } }).lean()

  const dataMap = new Map()
  samples.forEach(sample => {
    dataMap.set(sample._id.toString(), sample)
  })

  return sampleIds.map(id => dataMap.get(id.toString()))
}

export default function SampleLoader() {
  return new DataLoader(batchSamples)
}
