import TestModel from './test.model.js'

// QUERY
async function getAllTests(parent) {
  return await TestModel.find().lean()
}

async function getOneTest(parent, { _id }) {
  return await TestModel.findById(_id).lean()
}

// MUTATION
async function createUpdateTest(parent, { _id, test_input }) {
  let test

  if (!_id) {
    test = await TestModel.create(test_input)
  } else {
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
