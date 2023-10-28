import TestParameterModel from './test_parameter.model.js'

// QUERY
async function getAllTestParameters(parent) {
  return await TestParameterModel.find().lean()
}

async function getOneTestParameter(parent, { _id }) {
  return await TestParameterModel.findById(_id).lean()
}

// MUTATION
async function createUpdateTestParameter(parent, { _id, test_parameter_input }) {
  let test_parameter

  if (!_id) {
    test_parameter = await TestParameterModel.create(test_parameter_input)
  } else {
    test_parameter = await TestParameterModel.findByIdAndUpdate(
      _id,
      { $set: test_parameter_input },
      { new: true }
    ).lean()
  }

  return test_parameter
}

// LOADER
async function instrument(parent, args, context) {
  if (parent.instrument) {
    return await context.loaders.InstrumentLoader.load(parent.instrument)
  }

  return null
}

const Query = {
  getAllTestParameters,
  getOneTestParameter
}

const Mutation = {
  createUpdateTestParameter
}

const TestParameter = {
  instrument
}

const resolvers = {
  Query,
  Mutation,
  TestParameter
}

export default resolvers
