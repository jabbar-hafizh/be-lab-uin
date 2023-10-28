import DataLoader from 'dataloader'
import TestModel from './test.model.js'

const batchTests = async testIds => {
  const tests = await TestModel.find({ _id: { $in: testIds } }).lean()

  const dataMap = new Map()
  tests.forEach(test => {
    dataMap.set(test._id.toString(), test)
  })

  return testIds.map(id => dataMap.get(id.toString()))
}

export default function TestLoader() {
  return new DataLoader(batchTests)
}
