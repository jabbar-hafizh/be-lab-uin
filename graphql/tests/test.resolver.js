import moment from 'moment/moment.js'

import SampleModel from '../samples/sample.model.js'
import TestParameterModel from '../test_parameters/test_parameter.model.js'
import TestModel from './test.model.js'

// QUERY
async function getAllTests(parent) {
  return await TestModel.find().lean()
}

async function getOneTest(parent, { _id }) {
  return await TestModel.findById(_id).lean()
}

// MUTATION
async function createUpdateTest(parent, { _id, test_input }, ctx) {
  let test
  const total_tests = await TestModel.count({
    createdAt: {
      $gte: moment().startOf('day').toDate(),
      $lte: moment().endOf('day').toDate()
    }
  })

  if (!_id) {
    test_input.id_test =
      moment().format('YYYYMMDD') + String(total_tests + 1).padStart(5, '0')

    const test_parameter_ids = []
    if (test_input?.test_parameters?.length) {
      for (const each_test_parameter of test_input.test_parameters) {
        const test_parameter = await TestParameterModel.create(each_test_parameter)
        test_parameter_ids.push(test_parameter._id)
      }
    }

    const sample_ids = []
    if (test_input?.samples?.length) {
      for (const [each_sample_index, each_sample] of test_input.samples.entries()) {
        each_sample.lab_label = `${test_input.id_test}-${String(each_sample_index + 1)}`
        each_sample.results = []
        for (const each_test_parameter_id of test_parameter_ids) {
          each_sample.results.push({
            test_parameter: each_test_parameter_id
          })
        }
        const sample = await SampleModel.create(each_sample)
        sample_ids.push(sample._id)
      }
    }

    test_input.samples = sample_ids
    test_input.test_parameters = test_parameter_ids
    test_input.buyer = ctx.user_id
    test_input.histories = [
      {
        status: 'Draft',
        updated_by: ctx.user_id,
        date: moment().format('DD-MM-YYYY HH:mm')
      }
    ]

    test = await TestModel.create(test_input)
  } else {
    test = await TestModel.findById(_id).lean()

    if (!test) throw new Error('Test Not Found!')

    if (test_input.current_status && test_input.current_status !== test.current_status) {
      await TestModel.findByIdAndUpdate(
        test._id,
        {
          $push: {
            histories: {
              $each: [
                {
                  status: test_input.current_status,
                  updated_by: ctx.user_id,
                  date: moment().format('DD-MM-YYYY HH:mm')
                }
              ]
            }
          }
        },
        {
          new: true
        }
      )
    }

    test = await TestModel.findByIdAndUpdate(
      _id,
      { $set: test_input },
      { new: true }
    ).lean()
  }

  return test
}

// LOADER
async function korbid(parent, args, context) {
  if (parent.korbid) {
    return await context.loaders.UserLoader.load(parent.korbid)
  }

  return null
}

async function dekan(parent, args, context) {
  if (parent.dekan) {
    return await context.loaders.UserLoader.load(parent.dekan)
  }

  return null
}

async function buyer(parent, args, context) {
  if (parent.buyer) {
    return await context.loaders.UserLoader.load(parent.buyer)
  }

  return null
}

async function samples(parent, args, context) {
  if (parent.samples) {
    return await context.loaders.SampleLoader.loadMany(parent.samples)
  }

  return null
}

async function test_parameters(parent, args, context) {
  if (parent.test_parameters) {
    return await context.loaders.TestParameterLoader.loadMany(parent.test_parameters)
  }

  return null
}

async function updated_by(parent, args, context) {
  if (parent.updated_by) {
    return await context.loaders.UserLoader.load(parent.updated_by)
  }

  return null
}

const Query = {
  getAllTests,
  getOneTest
}

const Mutation = {
  createUpdateTest
}

const Test = {
  korbid,
  dekan,
  buyer,
  samples,
  test_parameters
}

const TestHistory = {
  updated_by
}

const resolvers = {
  Query,
  Mutation,
  Test,
  TestHistory
}

export default resolvers
