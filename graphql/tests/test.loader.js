import DataLoader from 'dataloader'
import mongoose from 'mongoose'

import TestModel from './test.model.js'

const batchTests = async testIds => {
  const query = {
    $and: [{ _id: testIds.map(testId => new mongoose.Types.ObjectId(testId)) }]
  }
  const aggregateQuery = [
    { $match: query },
    {
      $lookup: {
        from: 'test_parameters',
        localField: 'test_parameters',
        foreignField: '_id',
        as: 'test_parameters_populate'
      }
    },
    {
      $addFields: {
        unit_price: {
          $sum: '$test_parameters_populate.price'
        }
      }
    },
    {
      $addFields: {
        total_price: {
          $multiply: ['$unit_price', '$sample_quantity']
        }
      }
    }
  ]
  const tests = await TestModel.aggregate(aggregateQuery)

  const dataMap = new Map()
  tests.forEach(test => {
    test.test_parameters_populate = undefined
    dataMap.set(test._id.toString(), test)
  })

  return testIds.map(id => dataMap.get(id.toString()))
}

export default function TestLoader() {
  return new DataLoader(batchTests)
}
