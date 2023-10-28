import DataLoader from 'dataloader'
import TestParameterModel from './test_parameter.model.js'

const batchTestParameters = async testParameterIds => {
  const testParameters = await TestParameterModel.find({ _id: { $in: testParameterIds } }).lean()

  const dataMap = new Map()
  testParameters.forEach(testParameter => {
    dataMap.set(testParameter._id.toString(), testParameter)
  })

  return testParameterIds.map(id => dataMap.get(id.toString()))
}

export default function TestParameterLoader() {
  return new DataLoader(batchTestParameters)
}
