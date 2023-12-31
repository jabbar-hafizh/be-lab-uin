import moment from 'moment/moment.js'
import mongoose from 'mongoose'

import SampleModel from '../samples/sample.model.js'
import TestParameterModel from '../test_parameters/test_parameter.model.js'
import UserModel from '../users/user.model.js'
import TestModel from './test.model.js'

// QUERY
async function getAllTests(parent, { filter }, ctx) {
  const query = {
    $and: [{ _id: { $ne: null } }]
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
    },
    {
      $sort: { createdAt: -1 }
    }
  ]

  const user_logged_in = await UserModel.findById(ctx.user_id).lean()

  if (user_logged_in?.roles?.length && user_logged_in.roles.includes('Umum')) {
    query.$and.push({
      buyer: new mongoose.Types.ObjectId(ctx.user_id)
    })
  }

  if (filter) {
    if (filter?.current_statuses?.length) {
      query.$and.push({ current_status: { $in: filter.current_statuses } })
    }
  }

  const tests = await TestModel.aggregate(aggregateQuery)

  return tests
}

async function getOneTest(parent, { _id }) {
  const query = {
    $and: [{ _id: new mongoose.Types.ObjectId(_id) }]
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

  return tests?.length ? tests[0] : null
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
        status: test_input.current_status || 'Draft',
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
                  date: moment().format('DD-MM-YYYY HH:mm'),
                  remark: test_input.remark
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

    const test_parameter_ids = []
    if (test_input?.test_parameters?.length) {
      for (const each_test_parameter of test_input.test_parameters) {
        if (each_test_parameter._id) {
          await TestParameterModel.findByIdAndUpdate(each_test_parameter._id, {
            $set: each_test_parameter
          })
        } else {
          const test_parameter = await TestParameterModel.create(each_test_parameter)
          test_parameter_ids.push(test_parameter._id)

          await TestParameterModel.deleteMany({ _id: { $in: test.test_parameters } })
        }
      }
    }

    const sample_ids = []
    if (test_input?.samples?.length) {
      for (const [each_sample_index, each_sample] of test_input.samples.entries()) {
        if (each_sample._id) {
          await SampleModel.findByIdAndUpdate(each_sample._id, {
            $set: each_sample
          })
        } else {
          each_sample.lab_label = `${test.id_test}-${String(each_sample_index + 1)}`
          each_sample.results = []
          for (const each_test_parameter_id of test_parameter_ids) {
            each_sample.results.push({
              test_parameter: each_test_parameter_id
            })
          }
          const sample = await SampleModel.create(each_sample)
          sample_ids.push(sample._id)

          await SampleModel.deleteMany({ _id: { $in: test.samples } })
        }
      }
    }

    test_input.samples = sample_ids.length ? sample_ids : undefined
    test_input.test_parameters = test_parameter_ids.length
      ? test_parameter_ids
      : undefined

    test = await TestModel.findByIdAndUpdate(
      _id,
      { $set: test_input },
      { new: true }
    ).lean()
  }

  return test
}

async function deleteTest(parent, { _id }) {
  const test = await TestModel.findById(_id).lean()

  if (test?.test_parameters?.length) {
    await TestParameterModel.deleteMany({ _id: { $in: test.test_parameters } })
  }

  if (test?.samples?.length) {
    await SampleModel.deleteMany({ _id: { $in: test.samples } })
  }

  return await TestModel.findByIdAndDelete(_id).lean()
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

async function ka_plt(parent, args, context) {
  if (parent.ka_plt) {
    return await context.loaders.UserLoader.load(parent.ka_plt)
  }

  return null
}

const Query = {
  getAllTests,
  getOneTest
}

const Mutation = {
  createUpdateTest,
  deleteTest
}

const Test = {
  korbid,
  dekan,
  buyer,
  samples,
  test_parameters,
  ka_plt
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
